import { createClient } from '@/lib/database/supabase/server';

/**
 * Service for fetching token and reputation data for the UI.
 * Uses the authenticated user's client.
 */
export async function getUserTokenData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: tokenAccount } = await supabase
    .from('token_accounts')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: reputation } = await supabase
    .from('user_reputation')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: transactions } = await supabase
    .from('token_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return {
    tokenAccount,
    reputation,
    transactions: transactions || []
  };
}

export async function getTokenConfig() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('token_config')
    .select('*')
    .single();
    
  return data;
}
