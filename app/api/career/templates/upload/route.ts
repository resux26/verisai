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

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File | null;
    const preview = formData.get('preview') as File | null;

    if (!title || !category || !file) {
      return NextResponse.json({ error: 'Missing required fields or file' }, { status: 400 });
    }

    // Attempt to upload file to 'templates' bucket
    // If the bucket doesn't exist, we will fallback to a demo path to avoid breaking completely
    let filePath = `demo/${file.name}`;
    let fileType = file.type;
    let fileSize = file.size;
    let previewPath = null;

    try {
      const fileName = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cv_templates') // Using cv_templates bucket
        .upload(fileName, file);

      if (uploadData) {
        // Construct the public URL for the file
        const { data: publicUrlData } = supabase.storage.from('cv_templates').getPublicUrl(uploadData.path);
        filePath = publicUrlData.publicUrl;
      } else if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return NextResponse.json({ error: `Storage Error (File): ${uploadError.message}. Did you create the 'cv_templates' bucket?` }, { status: 500 });
      }

      // Handle optional preview image
      if (preview) {
        const previewName = `${user.id}/preview-${Date.now()}-${preview.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { data: previewData, error: previewError } = await supabase.storage
          .from('cv_templates')
          .upload(previewName, preview);
          
        if (previewData) {
          const { data: previewUrlData } = supabase.storage.from('cv_templates').getPublicUrl(previewData.path);
          previewPath = previewUrlData.publicUrl;
        } else if (previewError) {
          console.error('Preview upload error:', previewError);
          return NextResponse.json({ error: `Storage Error (Preview): ${previewError.message}. Did you create the 'cv_templates' bucket?` }, { status: 500 });
        }
      }
    } catch (e: any) {
      console.error('Storage upload exception:', e);
      return NextResponse.json({ error: `Storage Exception: ${e.message}` }, { status: 500 });
    }

    // Insert template
    const { data: template, error } = await supabase
      .from('cv_templates')
      .insert({
        user_id: user.id,
        title,
        category,
        description,
        file_path: filePath,
        preview_path: previewPath,
        file_type: fileType,
        file_size: fileSize,
        visibility: 'public', // default to public to show in gallery
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting template:', error);
      return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 });
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
