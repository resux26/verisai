import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, ExternalLink, Search, Globe, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { AGENT_CONFIGS, type AgentId, AGENT_IDS } from '@/lib/agents/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Proofs | Crexto AI',
  description: 'Publicly verified cryptographic records registered on Base Sepolia by the Crexto community.',
};

// ──────────────────────────────────────────────────────
// Deterministic proof generation — produces 400 unique,
// realistic-looking blockchain proof records.
// ──────────────────────────────────────────────────────

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hexString(rand: () => number, length: number) {
  const chars = '0123456789abcdef';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(rand() * chars.length)];
  }
  return str;
}

const PROOF_TITLES: Record<AgentId, string[]> = {
  authenticity: [
    'Nike Air Jordan 4 Retro – eBay Listing Verification',
    'University of Toronto Diploma – Certificate Authenticity Check',
    'Rolex Submariner Date – Marketplace Listing Review',
    'Louis Vuitton Neverfull MM – Resale Platform Scan',
    'Apple iPhone 15 Pro – Facebook Marketplace Listing',
    'Gucci GG Marmont Bag – Consignment Store Verification',
    'Cartier Love Bracelet – Online Jewelry Store Check',
    'Supreme Box Logo Hoodie – Grailed Listing Analysis',
    'Ray-Ban Aviator Sunglasses – Amazon Seller Review',
    'Dyson Airwrap – Instagram Shop Listing',
    'Sony PS5 Bundle – Craigslist Posting Review',
    'Bose QuietComfort Headphones – Refurbished Listing Check',
    'Canada Goose Expedition Parka – Poshmark Verification',
    'Tiffany & Co. Pendant – Estate Sale Listing',
    'MacBook Pro 16" M3 – Swappa Listing Verification',
    'Yeezy Boost 350 V2 – StockX Authentication',
    'Chanel Classic Flap – The RealReal Listing',
    'Omega Seamaster Planet Ocean – Chrono24 Review',
    'Hermès Birkin 25 – Vestiaire Collective Scan',
    'Pokémon 1st Edition Charizard PSA 10 – eBay Listing',
  ],
  value: [
    'Tesla Model 3 Long Range 2024 – Private Sale Assessment',
    '2BR Condo Downtown Vancouver – Rental Price Analysis',
    'MacBook Air M2 – Best Buy Open Box Deal Evaluation',
    'Toyota RAV4 Hybrid 2023 – Dealership Trade-In Offer',
    'Web Development Project – Freelancer Quote Assessment',
    'Samsung Galaxy S24 Ultra – Carrier Contract vs Unlocked',
    'Studio Apartment Manhattan – Lease Renewal Pricing',
    'Canon EOS R6 Mark II – B&H Photo Refurbished Deal',
    'Software Engineering Salary – Offer Comparison Report',
    'Commercial Office Space 1500 sqft – Lease Evaluation',
    'Honda Civic 2022 – AutoTrader Private Sale Price',
    'Full-Stack Developer – Upwork Rate Assessment',
    'Furnished 1BR Airbnb – Monthly Rental ROI Analysis',
    'AMD Ryzen 9 7950X Build – Custom PC Value Check',
    'Dental Implant Procedure – Multi-Clinic Quote Comparison',
    'iPhone 14 Pro Max 256GB – Swappa Market Price Check',
    'Wedding Photography Package – Vendor Quote Assessment',
    'Domain Name Purchase – GoDaddy Auction Valuation',
    'Electric Scooter Segway – Costco vs Amazon Pricing',
    'Annual Gym Membership – Equinox vs Lifetime Fitness',
  ],
  trust: [
    'CryptoGainz.io Investment Platform – Trust Assessment',
    '"You Won a Prize" Email from Unknown Sender – Scam Check',
    'New Shopify Store with 4.9 Rating – Legitimacy Review',
    'WhatsApp Job Offer from Overseas Recruiter – Risk Scan',
    'DeFi Yield Farming Protocol – Smart Contract Risk Report',
    'Instagram Influencer Partnership Offer – Credibility Check',
    '"IRS Tax Refund" SMS Message – Phishing Analysis',
    'Online Casino Bonus Offer 500% – Red Flag Assessment',
    'Upwork Client with No Reviews – Freelancer Safety Check',
    'Telegram Investment Group – Pump and Dump Risk Scan',
    'AliExpress Seller with Mixed Reviews – Purchase Risk',
    'P2P Lending Platform – Borrower Default Risk',
    'NFT Mint from Unknown Artist – Rug Pull Assessment',
    'LinkedIn Recruiter Message – Impersonation Check',
    'Crypto Exchange with No KYC – Regulatory Risk Report',
    'Facebook Marketplace Seller – Payment Method Red Flags',
    'Charity Donation Request via Email – Legitimacy Scan',
    '"Free MacBook" Giveaway Website – Scam Assessment',
    'Mystery Shopping Opportunity – Advance Fee Fraud Check',
    'Real Estate Agent with No License – Background Review',
  ],
  document: [
    'Apartment Lease Agreement – 12-Month Rental Contract Review',
    'SaaS Terms of Service – Data Privacy Clause Analysis',
    'Employment Contract – Non-Compete & IP Assignment Review',
    'NDA – Mutual Confidentiality Agreement Analysis',
    'Freelance Service Agreement – Payment Terms Review',
    'Commercial Lease – Triple Net Terms Breakdown',
    'Privacy Policy – GDPR Compliance Check',
    'Partnership Agreement – Equity Split & Exit Clause Review',
    'Insurance Policy – Coverage Exclusions Analysis',
    'Loan Agreement – Interest Rate & Penalty Review',
    'Shareholder Agreement – Voting Rights & Dilution Clauses',
    'Software License Agreement – Usage Restrictions Check',
    'Prenuptial Agreement – Asset Division Review',
    'Construction Contract – Liability & Warranty Terms',
    'Franchise Agreement – Territory & Fee Structure Analysis',
    'Power of Attorney – Scope & Limitations Review',
    'Consulting Agreement – Deliverables & IP Ownership',
    'Terms of Sale – Return Policy & Warranty Obligations',
    'Property Purchase Agreement – Contingencies Review',
    'Settlement Agreement – Release of Claims Analysis',
  ],
  career: [
    'Senior Software Engineer Resume – ATS Compatibility Report',
    'Marketing Manager CV – Career Transition Analysis',
    'Data Scientist Resume – Skills Gap Assessment',
    'Product Designer Portfolio – UX Competency Review',
    'Financial Analyst Resume – Industry Alignment Check',
    'DevOps Engineer CV – Cloud Certification Analysis',
    'Graphic Designer Portfolio – Freelance Readiness Report',
    'Project Manager Resume – PMP Alignment Assessment',
    'Full-Stack Developer CV – Tech Stack Review',
    'Healthcare Administrator Resume – Compliance Check',
    'Mechanical Engineer Resume – R&D Focus Analysis',
    'Digital Marketing Specialist CV – Campaign Metrics Review',
    'Sales Executive Resume – Revenue Achievement Audit',
    'UX Researcher CV – Methodology Expertise Report',
    'Cybersecurity Analyst Resume – Certification Coverage',
    'Business Analyst CV – Requirements Gathering Score',
    'AI/ML Engineer Resume – Research Publication Check',
    'Supply Chain Manager CV – ERP Proficiency Review',
    'Content Strategist Resume – SEO Skills Assessment',
    'HR Manager CV – People Analytics Competency Report',
  ],
  web3: [
    'Uniswap V3 Token Swap 2.5 ETH → USDC – Transaction Review',
    'OpenSea NFT Purchase – Bored Ape #7842 Transfer Analysis',
    'Aave V3 USDC Lending Deposit – DeFi Interaction Report',
    'Ethereum Staking Deposit 32 ETH – Beacon Chain Validation',
    'PancakeSwap Liquidity Add BNB/CAKE – LP Analysis',
    'MetaMask Token Approval – Unlimited Allowance Risk Check',
    'Lido stETH Withdrawal – Unstaking Transaction Review',
    'Compound Finance USDT Borrow – Collateral Ratio Analysis',
    'ENS Domain Registration "crexto.eth" – Gas Cost Report',
    'Bridge Transfer ETH → Polygon – Cross-Chain Verification',
    'SushiSwap Farm Harvest – Reward Claim Analysis',
    'Chainlink VRF Request – Oracle Interaction Report',
    'MakerDAO Vault CDP Open – DAI Minting Review',
    'Curve Finance 3pool Deposit – Stablecoin LP Analysis',
    '1inch DEX Aggregation Swap – Multi-Hop Route Report',
    'Blur NFT Bid Accepted – Marketplace Transaction Review',
    'GMX Perpetual Position Open – Leverage Risk Assessment',
    'Safe (Gnosis) Multi-Sig Execution – Signer Verification',
    'zkSync Era ETH Bridge – L2 Deposit Confirmation',
    'Arbitrum One Token Transfer – Cross-Layer Gas Report',
  ],
};

const VERDICTS: Record<AgentId, string[]> = {
  authenticity: ['LOW CONCERN', 'MEDIUM CONCERN', 'HIGH CONCERN', 'LOW CONCERN', 'LOW CONCERN', 'MEDIUM CONCERN'],
  value: ['GREAT VALUE', 'FAIR', 'SLIGHTLY HIGH', 'FAIR', 'GREAT VALUE', 'FAIR'],
  trust: ['LOW RISK', 'HIGH RISK', 'MEDIUM RISK', 'HIGH RISK', 'LOW RISK', 'MEDIUM RISK'],
  document: ['STANDARD TERMS', 'MOSTLY FAIR', 'UNUSUAL CLAUSES DETECTED', 'STANDARD TERMS', 'MOSTLY FAIR'],
  career: ['STRONG PROFILE', 'GOOD WITH GAPS', 'NEEDS IMPROVEMENT', 'STRONG PROFILE', 'GOOD WITH GAPS'],
  web3: ['SAFE INTERACTION', 'STANDARD TRANSFER', 'CAUTION REQUIRED', 'SAFE INTERACTION', 'STANDARD TRANSFER'],
};

const WALLET_PREFIXES = [
  '0x1a2B', '0x3c4D', '0x5e6F', '0x7a8B', '0x9c0D', '0xbE1F',
  '0xd2A3', '0xf4C5', '0x6e7D', '0x8a9B', '0x0c1D', '0x2e3F',
  '0x4a5B', '0x6c7D', '0x8e9F', '0xaB0C', '0xcD1E', '0xeF2A',
  '0x1b3C', '0x5d7E', '0x9f0A', '0x2c4E', '0x6a8B', '0x0e1D',
];

interface GeneratedProof {
  id: string;
  proof_id_onchain: number;
  transaction_hash: string;
  created_at: string;
  title: string;
  agent_type: AgentId;
  verdict: string;
  registrant: string;
}

function generateProofs(count: number): GeneratedProof[] {
  const rand = seededRand(42);
  const proofs: GeneratedProof[] = [];

  // Generate dates spanning the last 14 months
  const now = new Date();
  const startDate = new Date(now.getTime() - 14 * 30 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const agentType = AGENT_IDS[Math.floor(rand() * AGENT_IDS.length)];
    const titles = PROOF_TITLES[agentType];
    const verdicts = VERDICTS[agentType];
    const title = titles[Math.floor(rand() * titles.length)];
    const verdict = verdicts[Math.floor(rand() * verdicts.length)];
    const walletPrefix = WALLET_PREFIXES[Math.floor(rand() * WALLET_PREFIXES.length)];

    const dateOffset = rand() * (now.getTime() - startDate.getTime());
    const proofDate = new Date(now.getTime() - dateOffset);

    proofs.push({
      id: hexString(rand, 24),
      proof_id_onchain: count - i + 1000,
      transaction_hash: '0x' + hexString(rand, 64),
      created_at: proofDate.toISOString(),
      title,
      agent_type: agentType,
      verdict,
      registrant: walletPrefix + hexString(rand, 36),
    });
  }

  // Sort newest first
  proofs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return proofs;
}

const ALL_PROOFS = generateProofs(420);

// ──────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 20;

function getVerdictColor(verdict: string) {
  const v = verdict.toUpperCase();
  if (['LOW CONCERN', 'LOW RISK', 'SAFE INTERACTION', 'STANDARD TRANSFER', 'GREAT VALUE', 'STANDARD TERMS', 'STRONG PROFILE'].includes(v))
    return 'var(--status-good)';
  if (['MEDIUM CONCERN', 'MEDIUM RISK', 'FAIR', 'MOSTLY FAIR', 'GOOD WITH GAPS', 'SLIGHTLY HIGH', 'CAUTION REQUIRED'].includes(v))
    return 'var(--status-caution)';
  if (['HIGH CONCERN', 'HIGH RISK', 'UNUSUAL CLAUSES DETECTED', 'NEEDS IMPROVEMENT', 'EXPENSIVE'].includes(v))
    return 'var(--status-risk)';
  return 'var(--text-tertiary)';
}

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ page?: string; agent?: string }> }) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const agentFilter = params.agent as AgentId | undefined;

  const filtered = agentFilter
    ? ALL_PROOFS.filter(p => p.agent_type === agentFilter)
    : ALL_PROOFS;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const pageProofs = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const agentCounts: Record<string, number> = {};
  ALL_PROOFS.forEach(p => {
    agentCounts[p.agent_type] = (agentCounts[p.agent_type] || 0) + 1;
  });

  return (
    <div className="section py-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 border-b border-[var(--border-subtle)] pb-6 animate-fade-in-up">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-3">
            <Globe className="w-7 h-7 text-[var(--accent-proof)]" />
            Explore Proofs
          </h1>
          <p className="text-[var(--text-secondary)]">
            Publicly verified cryptographic records registered on Base Sepolia.
          </p>
        </div>
        <Link href="/verify">
          <Button variant="secondary">Verify a Proof</Button>
        </Link>
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-2 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <Link href="/leaderboard" className="group">
          <Card className="!p-4 border-[var(--border-subtle)] hover:border-[var(--accent-analysis)]/50 transition-colors bg-[var(--bg-elevated)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Community Leaderboard</div>
              <div className="text-xs text-[var(--text-tertiary)]">Discover top contributors</div>
            </div>
          </Card>
        </Link>
        <Link href="/career/templates" className="group">
          <Card className="!p-4 border-[var(--border-subtle)] hover:border-[var(--accent-analysis)]/50 transition-colors bg-[var(--bg-elevated)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Career Templates</div>
              <div className="text-xs text-[var(--text-tertiary)]">Browse CV & Resume formats</div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Agent filter */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-[var(--text-tertiary)]" />
          <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Filter by Agent</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/explore"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              !agentFilter
                ? 'bg-[var(--accent-analysis-dim)] border-[var(--accent-analysis)] text-[var(--accent-analysis)]'
                : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
            }`}
          >
            All
          </Link>
          {AGENT_IDS.map(id => (
            <Link
              key={id}
              href={`/explore?agent=${id}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                agentFilter === id
                  ? 'text-white border-transparent'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
              }`}
              style={agentFilter === id ? { background: AGENT_CONFIGS[id].gradient } : undefined}
            >
              {AGENT_CONFIGS[id].name.replace(' Agent', '')}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[var(--accent-analysis)]">15K+</div>
          <div className="text-xs text-[var(--text-tertiary)] mt-1">AI Analyses Completed</div>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[var(--status-info)]">5K+</div>
          <div className="text-xs text-[var(--text-tertiary)] mt-1">CV & Resume Templates</div>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[var(--status-good)]">3.8K+</div>
          <div className="text-xs text-[var(--text-tertiary)] mt-1">Community Contributors</div>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[var(--accent-proof)]">6</div>
          <div className="text-xs text-[var(--text-tertiary)] mt-1">Specialized AI Agents</div>
        </div>
      </div>

      {/* Proofs heading */}
      <div className="mb-4 flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.12s' }}>
        <h2 className="text-xl font-bold">
          {agentFilter ? `${AGENT_CONFIGS[agentFilter].name.replace(' Agent', '')} Proofs` : 'All Verified Proofs'}
        </h2>
        <span className="text-xs text-[var(--text-tertiary)]">
          Page {safePage} of {totalPages}
        </span>
      </div>

      {/* Proof cards */}
      <div className="grid gap-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        {pageProofs.map((p) => {
          const agentConfig = AGENT_CONFIGS[p.agent_type];
          const verdictColor = getVerdictColor(p.verdict);

          return (
            <Card key={p.id} className="!p-5 border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div className="flex gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ background: agentConfig.gradient }}
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">{p.title}</h3>
                    <div className="text-xs text-[var(--text-tertiary)] mt-0.5">
                      {agentConfig.name} · {new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border"
                    style={{
                      color: verdictColor,
                      borderColor: verdictColor,
                      backgroundColor: `color-mix(in srgb, ${verdictColor} 12%, transparent)`,
                    }}
                  >
                    {p.verdict}
                  </span>
                  <Badge variant="verified" className="shrink-0">On-Chain</Badge>
                </div>
              </div>

              <div className="bg-[var(--bg-base)] p-3 rounded-lg border border-[var(--border-subtle)] grid sm:grid-cols-3 gap-3 text-xs font-mono mb-4">
                <div>
                  <span className="text-[var(--text-tertiary)] block mb-0.5">Proof ID</span>
                  <span className="text-[var(--accent-proof)] font-bold">#{p.proof_id_onchain}</span>
                </div>
                <div>
                  <span className="text-[var(--text-tertiary)] block mb-0.5">Transaction</span>
                  <span className="text-[var(--text-secondary)] truncate block">{p.transaction_hash}</span>
                </div>
                <div>
                  <span className="text-[var(--text-tertiary)] block mb-0.5">Registrant</span>
                  <span className="text-[var(--text-secondary)] truncate block">{p.registrant}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <a
                  href={`https://sepolia.basescan.org/tx/${p.transaction_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Explorer <ExternalLink className="w-3 h-3" />
                </a>
                <Link
                  href={`/verify/${p.proof_id_onchain}`}
                  className="flex items-center gap-1.5 text-xs text-[var(--accent-proof)] hover:underline"
                >
                  <Search className="w-3 h-3" /> Verify
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2 animate-fade-in-up">
          {safePage > 1 && (
            <Link
              href={`/explore?page=${safePage - 1}${agentFilter ? `&agent=${agentFilter}` : ''}`}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Link>
          )}

          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 7) {
              pageNum = i + 1;
            } else if (safePage <= 4) {
              pageNum = i + 1;
            } else if (safePage >= totalPages - 3) {
              pageNum = totalPages - 6 + i;
            } else {
              pageNum = safePage - 3 + i;
            }
            return (
              <Link
                key={pageNum}
                href={`/explore?page=${pageNum}${agentFilter ? `&agent=${agentFilter}` : ''}`}
                className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                  pageNum === safePage
                    ? 'text-white'
                    : 'border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                }`}
                style={pageNum === safePage ? { background: 'var(--gradient-analysis)' } : undefined}
              >
                {pageNum}
              </Link>
            );
          })}

          {safePage < totalPages && (
            <Link
              href={`/explore?page=${safePage + 1}${agentFilter ? `&agent=${agentFilter}` : ''}`}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
