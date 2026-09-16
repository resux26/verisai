import { createClient } from '@/lib/database/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  async function updateProfile(formData: FormData) {
    'use server'
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('profiles').update({
      full_name: formData.get('fullName'),
      username: formData.get('username'),
      bio: formData.get('bio'),
    }).eq('id', user.id);
  }

  return (
    <div className="section py-10 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 border-b border-border-default pb-6">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-text-secondary">
            Manage your personal settings and public profile.
          </p>
        </div>

        <Card className="p-8 bg-bg-secondary border-border-default shadow-glow">
          <form action={updateProfile} className="space-y-6">
            <Input 
              label="Email Address" 
              name="email"
              defaultValue={user.email} 
              disabled 
            />
            
            <Input 
              label="Username" 
              name="username"
              defaultValue={profile?.username || ''}
              placeholder="choose_a_username"
            />
            
            <Input 
              label="Full Name" 
              name="fullName"
              defaultValue={profile?.full_name || ''} 
              placeholder="Jane Doe"
            />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Bio</label>
              <textarea 
                name="bio"
                className="w-full h-32 px-4 py-2 bg-bg-primary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-sm text-text-primary placeholder:text-text-tertiary resize-none"
                placeholder="Tell the world about yourself..."
                defaultValue={profile?.bio || ''}
              />
            </div>

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
