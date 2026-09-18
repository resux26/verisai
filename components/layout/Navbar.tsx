'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Hexagon, LogOut, User } from 'lucide-react';
import { ConnectButton } from '../wallet/ConnectButton';

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Check if demo mode
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

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Explore', href: '/explore' },
    { name: 'AI Agents', href: '/agents' },
    { name: 'Analyze', href: '/analyze/value' },
    { name: 'Career', href: '/career' },
  ];

  if (user) {
    navLinks.push({ name: 'Dashboard', href: '/dashboard' });
    navLinks.push({ name: 'My Proofs', href: '/proofs' });
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-[#0B0E14]/90 backdrop-blur-xl">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <img src="/logo.png" alt="Crexto AI Logo" className="h-8 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-[var(--text-primary)] bg-[var(--bg-elevated)]' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden lg:flex items-center gap-2 mr-2 border-r border-[var(--border-subtle)] pr-4">
              <Link href="/profile" className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--border-hover)] hover:text-[var(--text-primary)] transition-colors">
                {user.email?.charAt(0).toUpperCase()}
              </Link>
              <form action="/auth/logout" method="POST">
                <button formAction={async () => {
                   const { logout } = await import('@/app/auth/actions');
                   await logout();
                }} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--status-risk)] transition-colors">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3 mr-2 border-r border-[var(--border-subtle)] pr-4">
              <Link href="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Login
              </Link>
            </div>
          )}
          <div className="hidden lg:block">
            <ConnectButton />
          </div>
          
          {/* Mobile menu toggle — visible below 1024px */}
          <button 
            className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation — slide-down panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] animate-slide-down absolute w-full left-0 shadow-lg z-50">
          <nav className="flex flex-col p-4 gap-1 max-w-[1200px] mx-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium min-h-[44px] flex items-center transition-colors ${
                    isActive 
                      ? 'text-[var(--accent-analysis)] bg-[var(--accent-analysis-dim)] border border-[var(--accent-analysis)]/20' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="border-t border-[var(--border-subtle)] my-2" />

            {/* Auth section in mobile */}
            {user ? (
              <div className="flex items-center justify-between px-4 py-3">
                <Link href="/profile" className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]" onClick={() => setIsMobileMenuOpen(false)}>
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <form action="/auth/logout" method="POST">
                  <button formAction={async () => {
                     const { logout } = await import('@/app/auth/actions');
                     await logout();
                  }} className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] hover:text-[var(--status-risk)]">
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] min-h-[44px] flex items-center">
                Login
              </Link>
            )}

            {/* Wallet in mobile */}
            <div className="px-4 py-3">
              <ConnectButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
