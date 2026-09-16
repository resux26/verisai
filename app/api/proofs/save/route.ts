import { NextResponse } from 'next/server';
import { createClient } from '@/lib/database/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Even without a user, we might allow saving the proof locally or just fail gracefully if demo mode
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !user) {
      return NextResponse.json({ success: true, message: 'Demo mode: proof not saved to DB.' });
    }

    const body = await request.json();
    const { proofId, txHash, contentHash, analysisHash, walletAddress } = body;

    if (!proofId || !txHash || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Try to find the analysis ID based on the hashes
    const { data: analysis } = await supabase
      .from('analyses')
      .select('id')
      .eq('input_hash', contentHash)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const analysisId = analysis ? analysis.id : null;

    // Insert into proofs table
    const { error } = await supabase.from('proofs').insert({
      user_id: user.id,
      analysis_id: analysisId,
      proof_id_onchain: proofId.toString(),
      blockchain_network: 'Base Sepolia',
      transaction_hash: txHash,
      wallet_address: walletAddress
    });

    if (error) {
      console.error("Failed to insert proof:", error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error saving proof:', error);
    return NextResponse.json({ error: error.message || 'Failed to save proof' }, { status: 500 });
  }
}
