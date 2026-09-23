import React from 'react';
import { createClient } from '@/lib/database/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AGENT_CONFIGS, AGENT_IDS } from '@/lib/agents/config';
import { 
  ShieldCheck, TrendingUp, Eye, FileSearch, Briefcase, Blocks,
  CheckCircle2, ArrowRight, Zap, Lock, FileText, Search,
  Upload, Brain, BarChart3, Shield, ChevronRight, Trophy
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  Eye: <Eye className="w-6 h-6" />,
  FileSearch: <FileSearch className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Blocks: <Blocks className="w-6 h-6" />,
};

export default async function Home() {
  const supabase = await createClient();
  let topUsers: any[] = [];
  try {
    const { data: repData } = await supabase
      .from('user_reputation')
      .select('*, profiles(username, full_name)')
      .order('total_points', { ascending: false })
      .limit(5);
    if (repData) topUsers = repData;
  } catch (e) {}

  return (
    <div className="flex flex-col min-h-screen">
      {/* ================================================================ */}
      {/* HERO SECTION */}
      {/* ================================================================ */}
      <section className="section py-16 md:py-28 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 w-full h-[600px] bg-gradient-radial from-[var(--accent-analysis-dim)]/30 to-transparent -z-10" />
        
        <div className="animate-fade-in-up w-full max-w-4xl">
          <Badge variant="accent" className="mb-6 text-xs px-4 py-1.5">
            AI Intelligence + Blockchain Verification
          </Badge>
          
          <h1 className="font-display font-extrabold mb-6 tracking-tight leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
            Know before you{' '}
            <span className="gradient-text">trust.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-10 leading-relaxed">
            Six specialized AI agents analyze products, documents, offers, career profiles, and blockchain activity — then give you clear evidence, risk assessments, and verifiable on-chain proofs.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/agents">
              <Button size="lg" className="w-full sm:w-auto font-bold text-lg px-8">
                Choose an Agent
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto font-bold text-lg px-8">
                How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* PUVEXA STYLE STATS */}
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 mt-16 md:mt-24 px-4 text-center w-full max-w-5xl mx-auto">
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">12,480+</div>
            <div className="text-sm text-[var(--text-secondary)] font-medium">Problems diagnosed</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">8,920</div>
            <div className="text-sm text-[var(--text-secondary)] font-medium">Verified fixes</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">2,400,000M+</div>
            <div className="text-sm text-[var(--text-secondary)] font-medium">FIX rewarded</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">3,850</div>
            <div className="text-sm text-[var(--text-secondary)] font-medium">Active contributors</div>
          </div>
        </div>

        {/* Live Example Card & Top 5 Contributors */}
        <div className="w-full max-w-6xl mx-auto mt-16 md:mt-20 animate-fade-in-up stagger-1 px-4">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 text-left">
            
            {/* Live Diagnosis Card */}
            <Card className="border-[#3B82F6]/30 bg-[#0F172A] p-6 md:p-8 flex flex-col" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 40px rgba(59,130,246,0.1)' }}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center">
                    <Search className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Live diagnosis</h3>
                    <p className="text-xs text-slate-400">Authenticity Agent · Smart Contract</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="good" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                    3 signatures matched
                  </Badge>
                  <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">
                    +70 CRX
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge variant="accent" className="bg-emerald-500 text-white border-none text-[10px] uppercase font-bold tracking-wider mb-2">Top Pick</Badge>
                      <h4 className="font-bold text-white">Verify Source Code Alignment</h4>
                    </div>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-xs"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-400 font-mono">
                    <span className="text-emerald-400 font-bold">92% success</span>
                    <span>1,280 cases</span>
                    <span>4 min</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white">Update Oracle Dependencies</h4>
                    <Badge variant="outline" className="text-purple-400 border-purple-500/30 text-xs"><Shield className="w-3 h-3 mr-1" /> High confidence</Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-400 font-mono">
                    <span className="text-emerald-400 font-bold">88% success</span>
                    <span>1,093 cases</span>
                    <span>8 min</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white">Reset Proxy Configuration</h4>
                    <Badge variant="outline" className="text-blue-400 border-blue-500/30 text-xs">Common fix</Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-400 font-mono">
                    <span className="text-emerald-400 font-bold">84% success</span>
                    <span>854 cases</span>
                    <span>6 min</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Top 5 Contributors Card */}
            <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 md:p-8 flex flex-col" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display text-xl font-bold">Top Contributors</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Community Leaderboard</p>
                </div>
                <Link href="/leaderboard" className="text-sm text-[var(--accent-analysis)] hover:underline flex items-center">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-3 flex-1">
                {topUsers.length === 0 ? (
                  <div className="text-center py-8 text-[var(--text-tertiary)]">
                    No contributors yet. Run the seed script!
                  </div>
                ) : (
                  topUsers.map((u, i) => (
                    <div key={u.user_id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] hover:border-[var(--border-hover)] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 text-center font-bold text-sm ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-[var(--text-tertiary)]'}`}>
                          #{i + 1}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center font-bold text-xs text-white">
                          {u.profiles?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{u.profiles?.full_name || 'Unknown User'}</div>
                          <div className="text-[10px] text-[var(--text-tertiary)]">@{u.profiles?.username || 'user'}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-sm text-[var(--accent-analysis)]">{u.total_points.toLocaleString()}</div>
                        <div className="text-[10px] uppercase tracking-widest text-[var(--text-tertiary)] font-bold">REP</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SIX AGENTS SHOWCASE */}
      {/* ================================================================ */}
      <section className="section py-16 md:py-24 bg-[var(--bg-surface)] border-t border-b border-[var(--border-subtle)]">
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Six Specialized AI Agents</h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Each agent is tuned for a specific domain — producing unique, structured intelligence reports, not generic summaries.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in-up stagger-1">
          {AGENT_IDS.map((agentId) => {
            const config = AGENT_CONFIGS[agentId];
            return (
              <Link key={agentId} href={`/analyze/${agentId}`} className="group">
                <div className="relative p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] hover:border-[var(--border-hover)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: config.gradient }}
                  >
                    {ICON_MAP[config.icon]}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{config.name}</h3>
                  <p className="text-sm text-[var(--text-tertiary)] italic mb-3">&quot;{config.question}&quot;</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">{config.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--text-tertiary)] group-hover:text-[var(--accent-analysis)] transition-colors">
                    Start Analysis <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================================================================ */}
      {/* HOW IT WORKS — MINI WORKFLOW */}
      {/* ================================================================ */}
      <section className="section py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How Crexto Works</h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            From raw evidence to verifiable on-chain proof — in three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 animate-fade-in-up stagger-1">
          {[
            {
              step: '01',
              icon: <Upload className="w-7 h-7" />,
              title: 'Bring Your Evidence',
              description: 'Upload a document, paste text, share a link, or describe what you need analyzed. Our agents handle screenshots, PDFs, contracts, transaction data, and more.',
              accent: '#3B82F6',
            },
            {
              step: '02',
              icon: <Brain className="w-7 h-7" />,
              title: 'AI Analyzes & Reports',
              description: 'Your chosen specialized agent extracts facts, evaluates signals, identifies risks, and produces a structured intelligence report — not a generic summary.',
              accent: '#8B5CF6',
            },
            {
              step: '03',
              icon: <Shield className="w-7 h-7" />,
              title: 'Verify & Prove',
              description: 'Optionally anchor your analysis on the blockchain. Create an immutable, timestamped proof that anyone can verify — without exposing your original documents.',
              accent: '#10B981',
            },
          ].map((item) => (
            <div key={item.step} className="relative">
              <div className="flex flex-col items-center text-center p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] h-full">
                <div className="text-5xl font-display font-extrabold mb-4 opacity-10">{item.step}</div>
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5 -mt-8"
                  style={{ background: `linear-gradient(135deg, ${item.accent}, ${item.accent}dd)` }}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 animate-fade-in-up stagger-2">
          <Link href="/how-it-works">
            <Button variant="secondary" size="lg">
              See Full Workflow <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ================================================================ */}
      {/* COMMUNITY & LEADERBOARD */}
      {/* ================================================================ */}
      <section className="section py-16 md:py-24 bg-[#1a1b26] border-t border-[var(--border-subtle)] relative overflow-hidden">
        <div className="absolute top-0 w-full h-[300px] bg-gradient-radial from-[var(--accent-analysis)]/10 to-transparent -z-10 pointer-events-none" />
        
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <Badge variant="accent" className="mb-4 uppercase tracking-widest text-[10px]">New Feature</Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-white">Community Leaderboard</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Earn reputation points and demo CRX tokens by running analyses and sharing knowledge with the community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-fade-in-up stagger-1">
          <Card className="!p-8 bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:border-slate-500 transition-colors">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center mb-6">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Top Contributors</h3>
            <p className="text-slate-400 mb-6">
              See who is building the most verified proofs and providing the best intelligence. Rank up to unlock exclusive features.
            </p>
            <Link href="/leaderboard">
              <Button variant="secondary" className="w-full bg-slate-800 hover:bg-slate-700 text-white border-none">View Leaderboard</Button>
            </Link>
          </Card>
          
          <Card className="!p-8 bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:border-slate-500 transition-colors">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Career Templates</h3>
            <p className="text-slate-400 mb-6">
              Browse CV and resume templates optimized for AI screening. Upload your own to earn community reputation.
            </p>
            <Link href="/career/templates">
              <Button variant="secondary" className="w-full bg-slate-800 hover:bg-slate-700 text-white border-none">Browse Gallery</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* ================================================================ */}
      {/* WHY CREXTO */}
      {/* ================================================================ */}
      <section className="section py-16 md:py-24 bg-[var(--bg-surface)] border-t border-b border-[var(--border-subtle)]">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Why Crexto AI</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Eye className="w-6 h-6 text-[var(--accent-analysis)]" />, title: 'AI Understands', desc: 'Extracts structured facts from messy screenshots, complex documents, and raw data.', bg: 'var(--accent-analysis-dim)' },
            { icon: <Zap className="w-6 h-6 text-[var(--accent-analysis)]" />, title: 'AI Analyzes', desc: 'Specialized agents assess value, authenticity, trust, contracts, careers, and Web3 risk.', bg: 'var(--accent-analysis-dim)' },
            { icon: <FileText className="w-6 h-6 text-[var(--accent-analysis)]" />, title: 'AI Explains', desc: 'Provides clear reasoning, identifies missing info, and suggests questions to ask.', bg: 'var(--accent-analysis-dim)' },
            { icon: <Lock className="w-6 h-6 text-[var(--accent-proof)]" />, title: 'Blockchain Proves', desc: 'Registers immutable cryptographic proofs on Base for public, permanent verification.', bg: 'var(--accent-proof-dim)' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: item.bg }}>
                {item.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/* FINAL CTA */}
      {/* ================================================================ */}
      <section className="section py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to verify what matters?
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-8">
            Choose a specialized agent, submit your evidence, and get an AI intelligence report in seconds. No account required to analyze.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/agents">
              <Button size="lg" className="w-full sm:w-auto font-bold text-lg px-8">
                Start Your First Analysis
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
