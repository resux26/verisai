import { NextResponse } from 'next/server';
import { runAgentAnalysis } from '@/lib/ai/aiClient';
import { createClient } from '@/lib/database/supabase/server';
import { isValidAgentId } from '@/lib/agents/config';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    const body = await request.json();
    const { agentType, fileContent, isImage, title, inputHash } = body;

    if (!agentType || !fileContent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate agent type against known agents
    if (!isValidAgentId(agentType)) {
      return NextResponse.json({ error: `Invalid agent type: ${agentType}` }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: 'AI is currently unavailable. (GEMINI_API_KEY is not configured)' 
      }, { status: 503 });
    }

    const result = await runAgentAnalysis(agentType, fileContent, isImage);

    // Save to database if authenticated
    if (user && !authError && inputHash) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const crypto = require('crypto');
        const analysisHash = crypto.createHash('sha256').update(JSON.stringify(result)).digest('hex');

        const { data: insertedData, error: insertError } = await supabase.from('analyses').insert({
          user_id: user.id,
          agent_type: agentType,
          title: title || 'Untitled Analysis',
          input_hash: inputHash,
          analysis_hash: analysisHash,
          structured_result: result,
          is_public: false
        }).select('id').single();

        if (insertedData) {
          // Grant reputation and token reward
          const { grantReward } = await import('@/lib/token/rewards');
          await grantReward(user.id, 'analysis_completed', insertedData.id);
        }
        
        // Pass the analysisHash back to the client so they can register it on-chain
        result._analysisHash = analysisHash;
      } catch (dbErr) {
        console.error("Failed to save to Supabase:", dbErr);
        // Continue even if DB save fails
      }
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error analyzing document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze document' },
      { status: 500 }
    );
  }
}
