/**
 * Central agent configuration registry.
 * Every agent in Crexto is defined here — its identity, visual styling,
 * capabilities, and the type of input it accepts.
 */

export type AgentId = 'authenticity' | 'value' | 'trust' | 'document' | 'career' | 'web3';

export interface AgentConfig {
  id: AgentId;
  name: string;
  tagline: string;
  question: string;
  description: string;
  /** Lucide icon name (used as string key, resolved in components) */
  icon: string;
  /** CSS custom property name for this agent's accent color */
  accentVar: string;
  /** Hex color for use in inline styles / charts */
  accentHex: string;
  /** Gradient CSS value */
  gradient: string;
  /** The types of input this agent accepts */
  inputTypes: ('file' | 'text' | 'url' | 'structured')[];
  /** Placeholder text for the text input */
  textPlaceholder: string;
  /** Placeholder text for the file upload */
  uploadLabel: string;
  /** The possible verdict values for this agent */
  verdicts: string[];
  /** Short examples of what users can analyze */
  examples: string[];
}

export const AGENT_CONFIGS: Record<AgentId, AgentConfig> = {
  authenticity: {
    id: 'authenticity',
    name: 'Authenticity Agent',
    tagline: 'Is it real?',
    question: 'Is it real?',
    description: 'Assess whether an item, document, certificate, listing, or other evidence appears genuine, suspicious, inconsistent, or insufficiently supported.',
    icon: 'ShieldCheck',
    accentVar: '--agent-authenticity',
    accentHex: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    inputTypes: ['file', 'text', 'url'],
    textPlaceholder: 'Paste a product listing, certificate text, or describe the item you want verified...',
    uploadLabel: 'Upload a photo, screenshot, or document to check authenticity',
    verdicts: ['LOW CONCERN', 'MEDIUM CONCERN', 'HIGH CONCERN', 'INSUFFICIENT EVIDENCE'],
    examples: [
      'Screenshot of a luxury brand product listing',
      'Photo of a certificate or diploma',
      'Text from a suspicious email or message',
    ],
  },
  value: {
    id: 'value',
    name: 'Value Agent',
    tagline: 'Is it worth it?',
    question: 'Is it worth it?',
    description: 'Assess whether an asking price appears reasonable based on the information supplied — product details, condition, market context, and comparable alternatives.',
    icon: 'TrendingUp',
    accentVar: '--agent-value',
    accentHex: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)',
    inputTypes: ['file', 'text', 'url', 'structured'],
    textPlaceholder: 'Describe the item, its condition, and the asking price. Example: "MacBook Pro M3 14-inch, 18GB RAM, 512GB SSD, asking $1,800, used for 6 months, comes with box and charger"',
    uploadLabel: 'Upload a screenshot of a product listing or marketplace ad',
    verdicts: ['GREAT VALUE', 'FAIR', 'SLIGHTLY HIGH', 'EXPENSIVE', 'INSUFFICIENT INFORMATION'],
    examples: [
      'Used laptop listing with specs and price',
      'Real estate listing or rent offer',
      'Freelancer quote for a project',
    ],
  },
  trust: {
    id: 'trust',
    name: 'Trust Agent',
    tagline: 'Should I trust this?',
    question: 'Should I trust this?',
    description: 'Assess whether a seller, website, offer, project, or proposition appears trustworthy based on available information — looking for red flags, pressure tactics, and credibility signals.',
    icon: 'Eye',
    accentVar: '--agent-trust',
    accentHex: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    inputTypes: ['file', 'text', 'url'],
    textPlaceholder: 'Paste a URL, describe an offer you received, or paste the message/ad you want assessed...',
    uploadLabel: 'Upload a screenshot of the website, ad, or message',
    verdicts: ['LOW RISK', 'MEDIUM RISK', 'HIGH RISK', 'UNKNOWN'],
    examples: [
      'Link to an unfamiliar online store',
      'Screenshot of a "too good to be true" offer',
      'Message from someone claiming to be from a company',
    ],
  },
  document: {
    id: 'document',
    name: 'Document Agent',
    tagline: 'What does this really say?',
    question: 'What does this really say?',
    description: 'Understand complicated documents — contracts, terms of service, invoices, rental agreements, NDAs — and surface obligations, risks, unusual clauses, and important dates.',
    icon: 'FileSearch',
    accentVar: '--agent-document',
    accentHex: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    inputTypes: ['file', 'text'],
    textPlaceholder: 'Paste the full text of the contract, agreement, or legal document you want analyzed...',
    uploadLabel: 'Upload a PDF, image, or text file of the document',
    verdicts: ['STANDARD TERMS', 'MOSTLY FAIR', 'UNUSUAL CLAUSES DETECTED', 'HIGH RISK', 'INSUFFICIENT DOCUMENT'],
    examples: [
      'Rental or lease agreement',
      'Employment contract or NDA',
      'Terms of service or privacy policy',
    ],
  },
  career: {
    id: 'career',
    name: 'Career Agent',
    tagline: 'How strong is my profile?',
    question: 'How strong is my profile?',
    description: 'Analyze CVs, resumes, cover letters, and job descriptions. Get feedback on strengths, gaps, ATS compatibility, and role alignment — or generate a polished CV from scratch.',
    icon: 'Briefcase',
    accentVar: '--agent-career',
    accentHex: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899, #DB2777)',
    inputTypes: ['file', 'text'],
    textPlaceholder: 'Paste your CV/resume text, or describe your experience and the role you\'re targeting...',
    uploadLabel: 'Upload your CV/resume as a PDF or document',
    verdicts: ['STRONG PROFILE', 'GOOD WITH GAPS', 'NEEDS IMPROVEMENT', 'WEAK ALIGNMENT', 'INSUFFICIENT INFORMATION'],
    examples: [
      'Upload a PDF resume for review',
      'Paste CV text + target job description',
      'Describe experience and ask for career analysis',
    ],
  },
  web3: {
    id: 'web3',
    name: 'Web3 Agent',
    tagline: 'What did this transaction do?',
    question: 'What did this transaction do?',
    description: 'Translate complex blockchain information — transactions, contract interactions, wallet activity, token approvals — into human-readable language and risk assessment.',
    icon: 'Blocks',
    accentVar: '--agent-web3',
    accentHex: '#06B6D4',
    gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
    inputTypes: ['text', 'file'],
    textPlaceholder: 'Paste a transaction hash, contract address, wallet address, or raw transaction data (JSON)...',
    uploadLabel: 'Upload a screenshot of a transaction or wallet activity',
    verdicts: ['SAFE INTERACTION', 'STANDARD TRANSFER', 'CAUTION REQUIRED', 'HIGH RISK', 'UNKNOWN CONTRACT'],
    examples: [
      'Ethereum transaction hash',
      'Smart contract interaction JSON',
      'Screenshot of a wallet approval request',
    ],
  },
};

/** All valid agent IDs */
export const AGENT_IDS = Object.keys(AGENT_CONFIGS) as AgentId[];

/** Get config for a specific agent, with runtime validation */
export function getAgentConfig(agentId: string): AgentConfig | null {
  return AGENT_CONFIGS[agentId as AgentId] ?? null;
}

/** Check if a string is a valid agent ID */
export function isValidAgentId(id: string): id is AgentId {
  return id in AGENT_CONFIGS;
}
