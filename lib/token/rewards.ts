import { createAdminClient } from '@/lib/database/supabase/admin';
import { REWARD_RULES, getReputationLevel } from './config';
import { RewardAction } from './types';

/**
 * Grants a reward to a user based on a specific action.
 * This should ONLY be called from secure server-side API routes.
 */
export async function grantReward(
  userId: string, 
  action: RewardAction, 
  referenceId?: string
): Promise<{ success: boolean; pointsGranted: number; tokensGranted: number; message?: string }> {
  const supabase = createAdminClient();
  const rule = REWARD_RULES[action];

  if (!rule) {
    return { success: false, pointsGranted: 0, tokensGranted: 0, message: 'Invalid reward action' };
  }

  // 1. Insert into reputation_events (Duplicate protection via UNIQUE constraint)
  const { error: repEventError } = await supabase
    .from('reputation_events')
    .insert({
      user_id: userId,
      event_type: rule.action,
      points: rule.points,
      reference_id: referenceId,
      metadata: { description: rule.description }
    });

  if (repEventError) {
    // If it's a unique constraint violation (code 23505), they already got the reward.
    if (repEventError.code === '23505') {
      return { success: false, pointsGranted: 0, tokensGranted: 0, message: 'Reward already granted for this action.' };
    }
    console.error('Error inserting reputation event:', repEventError);
    return { success: false, pointsGranted: 0, tokensGranted: 0, message: 'Failed to record reputation event.' };
  }

  // 2. Insert into token_transactions
  const { error: tokenTxError } = await supabase
    .from('token_transactions')
    .insert({
      user_id: userId,
      type: rule.action,
      amount: rule.tokens,
      description: rule.description,
      reference_id: referenceId,
      is_demo: true
    });
    
  if (tokenTxError && tokenTxError.code !== '23505') {
    console.error('Error inserting token tx:', tokenTxError);
  }

  // 3. Update user_reputation
  // We need to fetch the current points to update the level accurately, or use an RPC.
  // Using an RPC is safer for concurrency, but for MVP we'll fetch then update.
  const { data: repData } = await supabase
    .from('user_reputation')
    .select('total_points, analyses_count, proofs_count')
    .eq('user_id', userId)
    .single();

  if (repData) {
    const newPoints = (repData.total_points || 0) + rule.points;
    const newLevel = getReputationLevel(newPoints);
    
    // Also increment counters if applicable
    const isAnalysis = action === 'analysis_completed' || action === 'public_analysis';
    const isProof = action === 'proof_created';
    
    await supabase
      .from('user_reputation')
      .update({
        total_points: newPoints,
        level_name: newLevel,
        analyses_count: isAnalysis ? (repData.analyses_count || 0) + 1 : repData.analyses_count,
        proofs_count: isProof ? (repData.proofs_count || 0) + 1 : repData.proofs_count,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  } else {
    // Should exist due to trigger, but fallback:
    await supabase.from('user_reputation').insert({
      user_id: userId,
      total_points: rule.points,
      level_name: getReputationLevel(rule.points),
      analyses_count: action === 'analysis_completed' ? 1 : 0,
      proofs_count: action === 'proof_created' ? 1 : 0
    });
  }

  // 4. Update token_accounts
  const { data: tokenData } = await supabase
    .from('token_accounts')
    .select('token_balance, lifetime_earned')
    .eq('user_id', userId)
    .single();

  if (tokenData) {
    await supabase
      .from('token_accounts')
      .update({
        token_balance: (tokenData.token_balance || 0) + rule.tokens,
        lifetime_earned: (tokenData.lifetime_earned || 0) + rule.tokens,
        last_updated: new Date().toISOString()
      })
      .eq('user_id', userId);
  } else {
    await supabase.from('token_accounts').insert({
      user_id: userId,
      token_balance: rule.tokens,
      lifetime_earned: rule.tokens,
      is_demo: true
    });
  }

  return { 
    success: true, 
    pointsGranted: rule.points, 
    tokensGranted: rule.tokens 
  };
}
