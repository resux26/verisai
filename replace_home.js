const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Add createClient import
content = content.replace("import { Button } from '@/components/ui/Button';", "import { createClient } from '@/lib/database/supabase/server';\nimport { Button } from '@/components/ui/Button';");

// Change Home to async
content = content.replace("export default function Home() {", `export default async function Home() {
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
`);

const newSection = `
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
            <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">2,400,000+</div>
            <div className="text-sm text-[var(--text-secondary)] font-medium">CRX rewarded</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">3,850</div>
            <div className="text-sm text-[var(--text-secondary)] font-medium">Active contributors</div>
          </div>
        </div>

        {/* Live Example & Top 5 Card */}
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
                <div className="flex items-center gap-2">
                  <Badge variant="good" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                    3 signatures matched
                  </Badge>
                  <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                    +70 CRX
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge className="bg-emerald-500 text-white border-none text-[10px] uppercase font-bold tracking-wider mb-2">Top Pick</Badge>
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
                        <div className={\`w-6 text-center font-bold text-sm \${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-[var(--text-tertiary)]'}\`}>
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
`;

// Extract everything from start to end of live example card
const startMarker = "{/* Live Example Card */}";
const endMarker = "</section>";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newSection + "\n      " + content.substring(endIndex);
  fs.writeFileSync('app/page.tsx', content);
  console.log("Replaced successfully!");
} else {
  console.log("Markers not found");
}
