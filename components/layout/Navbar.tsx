'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, User, ChevronDown, LayoutDashboard, History, ShieldCheck, Settings, Activity } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://replace-me')) return;
    
    import('@/lib/database/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) setUser(data.user);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => subscription.unsubscribe();
    });
  }, []);

  useEffect(() => {
    // Close mobile menu and profile on route change
    // ESLint normally flags setState in useEffect, but this is a valid Next.js pattern for route changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
     
    setIsProfileOpen(false);
  }, [pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClick = () => setIsProfileOpen(false);
    if (isProfileOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [isProfileOpen]);

  const mainLinks = [
    { name: 'Home', href: '/' },
    { name: 'Agents', href: '/agents' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Explore', href: '/explore' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Career', href: '/career' },
  ];

  const userLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'History', href: '/history', icon: <History className="w-4 h-4" /> },
    { name: 'My Proofs', href: '/proofs', icon: <ShieldCheck className="w-4 h-4" /> },
    { name: 'Profile', href: '/profile', icon: <User className="w-4 h-4" /> },
  ];

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-[#0B0E14]/90 backdrop-blur-xl">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <img src="/logo.png" alt="Crexto AI Logo" className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all duration-300 group-hover:drop-shadow-[0_0_25px_rgba(168,85,247,0.9)]" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href) 
                  ? 'text-[var(--text-primary)] bg-[var(--bg-elevated)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="flex items-center gap-3">

          {/* Auth / Profile */}
          {user ? (
            <div className="hidden lg:block relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[var(--accent-analysis)]/20 flex items-center justify-center text-xs font-bold text-[var(--accent-analysis)]">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-tertiary)] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl shadow-lg py-2 animate-fade-in z-50">
                  <div className="px-4 py-2 border-b border-[var(--border-subtle)] mb-1">
                    <div className="text-xs text-[var(--text-tertiary)] truncate">{user.email}</div>
                  </div>
                  {userLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        isActive(link.href)
                          ? 'text-[var(--accent-analysis)] bg-[var(--accent-analysis)]/5'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-t border-[var(--border-subtle)] mt-1 pt-1">
                    <button
                      onClick={async () => {
                        const { logout } = await import('@/app/auth/actions');
                        await logout();
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--status-risk)] hover:bg-[var(--bg-hover)] w-full transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/login" className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors" style={{ background: 'var(--gradient-analysis)' }}>
                Sign Up
              </Link>
            </div>
          )}
          
          {/* Mobile menu toggle */}
          <button 
            className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] animate-slide-down absolute w-full left-0 shadow-lg z-50 max-h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="flex flex-col p-4 gap-1 max-w-[1200px] mx-auto">
            {/* Main links */}
            {mainLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium min-h-[44px] flex items-center transition-colors ${
                  isActive(link.href) 
                    ? 'text-[var(--accent-analysis)] bg-[var(--accent-analysis-dim)] border border-[var(--accent-analysis)]/20' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {link.name}
              </Link>
            ))}



            {/* User links if authenticated */}
            {user && (
              <>
                <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider px-4 py-1">Your Account</div>
                {userLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium min-h-[44px] flex items-center gap-3 transition-colors ${
                      isActive(link.href)
                        ? 'text-[var(--accent-analysis)] bg-[var(--accent-analysis-dim)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={async () => {
                    const { logout } = await import('@/app/auth/actions');
                    await logout();
                  }}
                  className="px-4 py-3 rounded-lg text-sm font-medium min-h-[44px] flex items-center gap-3 text-[var(--text-tertiary)] hover:text-[var(--status-risk)] hover:bg-[var(--bg-hover)] w-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
                <div className="border-t border-[var(--border-subtle)] my-2" />
              </>
            )}

            {/* Auth links if not authenticated */}
            {!user && (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] min-h-[44px] flex items-center">
                  Login
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-semibold text-white text-center min-h-[44px] flex items-center justify-center" style={{ background: 'var(--gradient-analysis)' }}>
                  Create Account
                </Link>
                <div className="border-t border-[var(--border-subtle)] my-2" />
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
