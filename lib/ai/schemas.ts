import { SchemaType, ResponseSchema } from '@google/generative-ai';
import type { AgentId } from '@/lib/agents/config';

// ============================================================================
// BASE SCHEMA — shared fields across all agents
// ============================================================================

const baseProperties: Record<string, ResponseSchema> = {
  verdict: {
    type: SchemaType.STRING,
    description: "The agent's final assessment verdict.",
  },
  confidence: {
    type: SchemaType.INTEGER,
    description: "Confidence score from 0 to 100.",
  },
  summary: {
    type: SchemaType.STRING,
    description: "A concise 2-3 sentence executive summary of the assessment.",
  },
  extractedFacts: {
    type: SchemaType.ARRAY,
    items: { type: SchemaType.STRING },
    description: "Objective facts extracted directly from the input evidence.",
  },
  positiveSignals: {
    type: SchemaType.ARRAY,
    items: { type: SchemaType.STRING },
    description: "Signals that increase trust, value, safety, or quality.",
  },
  concernSignals: {
    type: SchemaType.ARRAY,
    items: { type: SchemaType.STRING },
    description: "Red flags, warnings, inconsistencies, or negative signals.",
  },
  missingInformation: {
    type: SchemaType.ARRAY,
    items: { type: SchemaType.STRING },
    description: "Crucial context or data that was NOT provided but would affect the assessment.",
  },
  recommendations: {
    type: SchemaType.ARRAY,
    items: { type: SchemaType.STRING },
    description: "Specific, actionable next steps for the user.",
  },
  questionsForUser: {
    type: SchemaType.ARRAY,
    items: { type: SchemaType.STRING },
    description: "Questions the user should ask to clarify the situation.",
  },
  disclaimer: {
    type: SchemaType.STRING,
    description: "A mandatory disclaimer specific to this agent's domain.",
  },
};

const baseRequired = [
  'verdict', 'confidence', 'summary', 'extractedFacts',
  'positiveSignals', 'concernSignals', 'missingInformation',
  'recommendations', 'questionsForUser', 'disclaimer',
];

// Helper to create an agent schema by extending the base
function createAgentSchema(
  extraProperties: Record<string, ResponseSchema>,
  extraRequired: string[] = []
): ResponseSchema {
  return {
    type: SchemaType.OBJECT,
    properties: { ...baseProperties, ...extraProperties },
    required: [...baseRequired, ...extraRequired],
  };
}

// ============================================================================
// AUTHENTICITY AGENT SCHEMA
// ============================================================================

export const authenticitySchema: ResponseSchema = createAgentSchema({
  evidenceQuality: {
    type: SchemaType.STRING,
    description: "Assessment of the quality/completeness of the evidence provided. One of: HIGH, MODERATE, LOW, INSUFFICIENT.",
  },
  authenticitySignals: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        signal: { type: SchemaType.STRING, description: "The specific authenticity signal found." },
        weight: { type: SchemaType.STRING, description: "Importance: STRONG, MODERATE, or WEAK." },
        direction: { type: SchemaType.STRING, description: "SUPPORTS_AUTHENTICITY or CHALLENGES_AUTHENTICITY." },
      },
      required: ['signal', 'weight', 'direction'],
    },
    description: "Detailed breakdown of authenticity indicators found in the evidence.",
  },
  inconsistencies: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        description: { type: SchemaType.STRING, description: "What the inconsistency is." },
        severity: { type: SchemaType.STRING, description: "MINOR, MODERATE, or CRITICAL." },
      },
      required: ['description', 'severity'],
    },
    description: "Specific inconsistencies, contradictions, or anomalies detected.",
  },
  verificationSuggestions: {
    type: SchemaType.ARRAY,
    items: { type: SchemaType.STRING },
    description: "Concrete steps the user can take to further verify authenticity independently.",
  },
}, ['evidenceQuality', 'authenticitySignals', 'inconsistencies', 'verificationSuggestions']);

// ============================================================================
// VALUE AGENT SCHEMA
// ============================================================================

export const valueSchema: ResponseSchema = createAgentSchema({
  itemIdentified: {
    type: SchemaType.STRING,
    description: "The specific item/service identified from the input.",
  },
  askingPrice: {
    type: SchemaType.STRING,
    description: "The asking price extracted from the input, or 'NOT SPECIFIED' if not provided.",
  },
  estimatedRange: {
    type: SchemaType.OBJECT,
    properties: {
      low: { type: SchemaType.STRING, description: "Estimated low end of fair market value." },
      high: { type: SchemaType.STRING, description: "Estimated high end of fair market value." },
      currency: { type: SchemaType.STRING, description: "Currency code (e.g. USD, EUR, BDT)." },
    },
    required: ['low', 'high', 'currency'],
    description: "Estimated fair market value range based on available information.",
  },
  pricePosition: {
    type: SchemaType.STRING,
    description: "Where the asking price falls: BELOW_MARKET, FAIR, ABOVE_MARKET, SIGNIFICANTLY_ABOVE, or UNKNOWN.",
  },
  valueFactors: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        factor: { type: SchemaType.STRING, description: "The value factor (e.g. condition, age, brand, demand)." },
        impact: { type: SchemaType.STRING, description: "INCREASES_VALUE, DECREASES_VALUE, or NEUTRAL." },
        note: { type: SchemaType.STRING, description: "Brief explanation." },
      },
      required: ['factor', 'impact', 'note'],
    },
    description: "Key factors affecting the value assessment.",
  },
  conditionAssessment: {
    type: SchemaType.STRING,
    description: "Assessment of the item's condition based on available information.",
  },
}, ['itemIdentified', 'askingPrice', 'estimatedRange', 'pricePosition', 'valueFactors']);

// ============================================================================
// TRUST AGENT SCHEMA
// ============================================================================

export const trustSchema: ResponseSchema = createAgentSchema({
  entityIdentified: {
    type: SchemaType.STRING,
    description: "The entity being assessed (person, website, company, project).",
  },
  entityType: {
    type: SchemaType.STRING,
    description: "Type of entity: PERSON, WEBSITE, COMPANY, PROJECT, OFFER, or UNKNOWN.",
  },
  trustSignals: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        signal: { type: SchemaType.STRING, description: "The specific trust signal." },
        type: { type: SchemaType.STRING, description: "CREDIBILITY, TRANSPARENCY, TRACK_RECORD, SECURITY, or VERIFICATION." },
        weight: { type: SchemaType.STRING, description: "STRONG, MODERATE, or WEAK." },
      },
      required: ['signal', 'type', 'weight'],
    },
    description: "Signals that support trustworthiness.",
  },
  riskSignals: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        signal: { type: SchemaType.STRING, description: "The specific risk signal." },
        type: { type: SchemaType.STRING, description: "PRESSURE_TACTIC, DECEPTION, MISSING_INFO, TECHNICAL_RISK, or PATTERN_MATCH." },
        severity: { type: SchemaType.STRING, description: "LOW, MEDIUM, HIGH, or CRITICAL." },
      },
      required: ['signal', 'type', 'severity'],
    },
    description: "Signals that undermine trustworthiness.",
  },
  pressureTactics: {
    type: SchemaType.ARRAY,
    items: { type: SchemaType.STRING },
    description: "Psychological pressure tactics detected (urgency, scarcity, authority, fear).",
  },
  claimAnalysis: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        claim: { type: SchemaType.STRING, description: "A specific claim made by the entity." },
        assessment: { type: SchemaType.STRING, description: "VERIFIABLE, UNVERIFIABLE, EXAGGERATED, or MISLEADING." },
      },
      required: ['claim', 'assessment'],
    },
    description: "Analysis of specific claims made by the entity.",
  },
}, ['entityIdentified', 'entityType', 'trustSignals', 'riskSignals']);

// ============================================================================
// DOCUMENT AGENT SCHEMA
// ============================================================================

export const documentSchema: ResponseSchema = createAgentSchema({
  documentType: {
    type: SchemaType.STRING,
    description: "The type of document identified (e.g. CONTRACT, NDA, LEASE, INVOICE, TERMS_OF_SERVICE, POLICY, LETTER, OTHER).",
  },
  parties: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        name: { type: SchemaType.STRING, description: "Name or identifier of the party." },
        role: { type: SchemaType.STRING, description: "Their role in the document (e.g. LANDLORD, TENANT, EMPLOYER, EMPLOYEE, SERVICE_PROVIDER, CLIENT)." },
      },
      required: ['name', 'role'],
    },
    description: "Parties identified in the document.",
  },
  keyObligations: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        party: { type: SchemaType.STRING, description: "Which party has this obligation." },
        obligation: { type: SchemaType.STRING, description: "Description of the obligation." },
        importance: { type: SchemaType.STRING, description: "CRITICAL, IMPORTANT, or STANDARD." },
      },
      required: ['party', 'obligation', 'importance'],
    },
    description: "Key obligations and commitments extracted from the document.",
  },
  financialTerms: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        description: { type: SchemaType.STRING, description: "Description of the financial term." },
        amount: { type: SchemaType.STRING, description: "The amount or formula involved." },
        frequency: { type: SchemaType.STRING, description: "ONE_TIME, RECURRING, CONDITIONAL, or NOT_SPECIFIED." },
      },
      required: ['description', 'amount'],
    },
    description: "Financial terms, fees, payments, and penalties.",
  },
  importantDates: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        date: { type: SchemaType.STRING, description: "The date or timeframe." },
        significance: { type: SchemaType.STRING, description: "What this date represents." },
      },
      required: ['date', 'significance'],
    },
    description: "Important dates, deadlines, and time-sensitive clauses.",
  },
  unusualClauses: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        clause: { type: SchemaType.STRING, description: "Summary of the unusual clause." },
        concern: { type: SchemaType.STRING, description: "Why this clause is unusual or concerning." },
        severity: { type: SchemaType.STRING, description: "LOW, MODERATE, or HIGH." },
      },
      required: ['clause', 'concern', 'severity'],
    },
    description: "Clauses that are unusual, one-sided, or potentially concerning.",
  },
  terminationConditions: {
    type: SchemaType.ARRAY,
    items: { type: SchemaType.STRING },
    description: "Conditions under which the document/agreement can be terminated.",
  },
}, ['documentType', 'parties', 'keyObligations', 'financialTerms', 'importantDates', 'unusualClauses']);

// ============================================================================
// CAREER AGENT SCHEMA
// ============================================================================

export const careerSchema: ResponseSchema = createAgentSchema({
  profileType: {
    type: SchemaType.STRING,
    description: "What was analyzed: CV, RESUME, COVER_LETTER, JOB_DESCRIPTION, CAREER_PROFILE, or COMPARISON.",
  },
  overallQuality: {
    type: SchemaType.STRING,
    description: "Overall quality assessment: EXCELLENT, GOOD, NEEDS_WORK, WEAK, or INSUFFICIENT.",
  },
  roleAlignment: {
    type: SchemaType.STRING,
    description: "If a target role was provided, alignment level: STRONG, MODERATE, WEAK, or NOT_APPLICABLE.",
  },
  strengthAreas: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        area: { type: SchemaType.STRING, description: "The strong area (e.g. 'Technical Skills', 'Leadership Experience')." },
        detail: { type: SchemaType.STRING, description: "What makes this area strong." },
      },
      required: ['area', 'detail'],
    },
    description: "The strongest sections/aspects of the career profile.",
  },
  improvementAreas: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        area: { type: SchemaType.STRING, description: "The area needing improvement." },
        suggestion: { type: SchemaType.STRING, description: "Specific actionable suggestion." },
        priority: { type: SchemaType.STRING, description: "HIGH, MEDIUM, or LOW priority." },
      },
      required: ['area', 'suggestion', 'priority'],
    },
    description: "Areas that need improvement with specific suggestions.",
  },
  missingKeywords: {
    type: SchemaType.ARRAY,
    items: { type: SchemaType.STRING },
    description: "Important industry/role keywords missing from the profile that would strengthen it.",
  },
  atsCompatibility: {
    type: SchemaType.STRING,
    description: "Assessment of ATS (Applicant Tracking System) compatibility: HIGH, MODERATE, LOW, or UNKNOWN.",
  },
  experienceLevel: {
    type: SchemaType.STRING,
    description: "Assessed experience level: ENTRY, JUNIOR, MID, SENIOR, LEAD, EXECUTIVE, or UNKNOWN.",
  },
}, ['profileType', 'overallQuality', 'strengthAreas', 'improvementAreas', 'missingKeywords', 'atsCompatibility']);

// ============================================================================
// WEB3 AGENT SCHEMA
// ============================================================================

export const web3Schema: ResponseSchema = createAgentSchema({
  interactionType: {
    type: SchemaType.STRING,
    description: "Type of blockchain interaction: TRANSFER, SWAP, APPROVAL, CONTRACT_CALL, DEPLOYMENT, MINT, STAKE, BRIDGE, GOVERNANCE, or UNKNOWN.",
  },
  network: {
    type: SchemaType.STRING,
    description: "Blockchain network identified (e.g. Ethereum, Base, Polygon, Solana, or UNKNOWN).",
  },
  addresses: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        address: { type: SchemaType.STRING, description: "The blockchain address." },
        role: { type: SchemaType.STRING, description: "FROM, TO, CONTRACT, SPENDER, or OPERATOR." },
        label: { type: SchemaType.STRING, description: "Known label if identifiable (e.g. 'Uniswap V3 Router'), or 'Unknown'." },
      },
      required: ['address', 'role', 'label'],
    },
    description: "Addresses involved in the interaction.",
  },
  assetsInvolved: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        asset: { type: SchemaType.STRING, description: "Token or asset name/symbol." },
        amount: { type: SchemaType.STRING, description: "Amount involved, or 'UNLIMITED' for unlimited approvals." },
        direction: { type: SchemaType.STRING, description: "SENT, RECEIVED, APPROVED, or LOCKED." },
      },
      required: ['asset', 'amount', 'direction'],
    },
    description: "Digital assets involved in the interaction.",
  },
  permissionsGranted: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        permission: { type: SchemaType.STRING, description: "What permission is being granted." },
        scope: { type: SchemaType.STRING, description: "LIMITED, BROAD, or UNLIMITED." },
        risk: { type: SchemaType.STRING, description: "LOW, MEDIUM, HIGH, or CRITICAL." },
      },
      required: ['permission', 'scope', 'risk'],
    },
    description: "Permissions or approvals granted in this interaction.",
  },
  functionCalled: {
    type: SchemaType.STRING,
    description: "The smart contract function called, if identifiable (e.g. 'approve', 'transfer', 'swap'), or 'N/A'.",
  },
  gasInfo: {
    type: SchemaType.STRING,
    description: "Gas cost assessment or notable gas usage information, if available.",
  },
  riskLevel: {
    type: SchemaType.STRING,
    description: "Overall risk level of this interaction: SAFE, LOW, MODERATE, HIGH, or CRITICAL.",
  },
  humanReadableSummary: {
    type: SchemaType.STRING,
    description: "A plain-English explanation of what this transaction actually does, written for a non-technical audience.",
  },
}, ['interactionType', 'network', 'addresses', 'assetsInvolved', 'riskLevel', 'humanReadableSummary']);

// ============================================================================
// SCHEMA REGISTRY
// ============================================================================

/** Map of agent ID to its specialized Gemini ResponseSchema */
export const AGENT_SCHEMAS: Record<AgentId, ResponseSchema> = {
  authenticity: authenticitySchema,
  value: valueSchema,
  trust: trustSchema,
  document: documentSchema,
  career: careerSchema,
  web3: web3Schema,
};

/** Get the appropriate schema for a given agent */
export function getAgentSchema(agentId: string): ResponseSchema {
  const schema = AGENT_SCHEMAS[agentId as AgentId];
  if (!schema) {
    throw new Error(`No schema defined for agent: ${agentId}`);
  }
  return schema;
}

// ============================================================================
// CV GENERATION SCHEMA (separate from analysis agents)
// ============================================================================

export const cvGenerationSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    name: { type: SchemaType.STRING },
    title: { type: SchemaType.STRING },
    location: { type: SchemaType.STRING },
    email: { type: SchemaType.STRING },
    phone: { type: SchemaType.STRING },
    summary: { type: SchemaType.STRING },
    education: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          institution: { type: SchemaType.STRING },
          degree: { type: SchemaType.STRING },
          year: { type: SchemaType.STRING },
        },
        required: ['institution', 'degree'],
      },
    },
    experience: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          company: { type: SchemaType.STRING },
          role: { type: SchemaType.STRING },
          period: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
        },
        required: ['company', 'role'],
      },
    },
    skills: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    projects: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          tech: { type: SchemaType.STRING },
        },
        required: ['name', 'description'],
      },
    },
  },
  required: ['name', 'title', 'summary', 'skills'],
};
