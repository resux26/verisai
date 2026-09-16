import { signup, signInWithGoogle } from '../auth/actions'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Hexagon } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="section min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
      <Card className="w-full max-w-md p-8 bg-[var(--bg-surface)] border-[var(--border-subtle)]" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4" style={{ background: 'var(--gradient-analysis)' }}>
            <Hexagon className="w-6 h-6 fill-white/20" />
          </div>
          <h2 className="font-display text-2xl font-bold text-center">Create an account</h2>
          <p className="text-[var(--text-secondary)] text-sm text-center mt-2">
            Join VerisAI to analyze documents and register cryptographic proofs.
          </p>
        </div>

        {searchParams?.error && (
          <div className="mb-6 p-3 text-sm text-[var(--status-risk)] bg-[var(--status-risk-bg)] border border-[var(--status-risk)]/20 rounded-lg">
            {searchParams.error}
          </div>
        )}

        <form className="flex flex-col gap-5">
          <Input 
            id="email" 
            name="email" 
            type="email" 
            label="Email address" 
            required 
            placeholder="you@example.com"
          />
          <Input 
            id="password" 
            name="password" 
            type="password" 
            label="Password" 
            required 
            placeholder="••••••••"
          />
          
          <div className="flex items-center justify-between mt-2">
            <Link href="/login" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Already have an account? Sign in
            </Link>
          </div>

          <Button formAction={signup} className="w-full mt-4">
            Create account
          </Button>
        </form>

        <div className="my-6 flex items-center justify-center gap-4">
          <span className="flex-1 border-b border-[var(--border-subtle)]"></span>
          <span className="text-xs text-center text-[var(--text-tertiary)]">or</span>
          <span className="flex-1 border-b border-[var(--border-subtle)]"></span>
        </div>

        <form>
          <Button variant="secondary" formAction={signInWithGoogle} className="w-full">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        </form>
      </Card>
    </div>
  )
}
