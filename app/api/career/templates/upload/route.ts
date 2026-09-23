import { NextResponse } from 'next/server';
import { createClient } from '@/lib/database/supabase/server';
import { grantReward } from '@/lib/token/rewards';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, category, description } = await req.json();

    if (!title || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert template
    const { data: template, error } = await supabase
      .from('cv_templates')
      .insert({
        user_id: user.id,
        title,
        category,
        description,
        visibility: 'public', // default to public to show in gallery
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting template:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Grant reward asynchronously
    try {
      await grantReward(user.id, 'template_published', template.id);
    } catch (rewardError) {
      console.error('Reward error:', rewardError);
    }

    return NextResponse.json({ success: true, template });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
