import { RewardAction, RewardRule } from './types';

export const REWARD_RULES: Record<RewardAction, RewardRule> = {
  profile_completed: {
    action: 'profile_completed',
    points: 10,
    tokens: 10,
    description: 'Completed user profile'
  },
  analysis_completed: {
    action: 'analysis_completed',
    points: 10,
    tokens: 10,
    description: 'Completed an AI analysis'
  },
  public_analysis: {
    action: 'public_analysis',
    points: 20,
    tokens: 20,
    description: 'Published a public analysis'
  },
  template_uploaded: {
    action: 'template_uploaded',
    points: 15,
    tokens: 15,
    description: 'Uploaded a CV template'
  },
  template_published: {
    action: 'template_published',
    points: 20,
    tokens: 20,
    description: 'Published a CV template to the community gallery'
  },
  proof_created: {
    action: 'proof_created',
    points: 25,
    tokens: 25,
    description: 'Registered an on-chain proof'
  },
  verification_completed: {
    action: 'verification_completed',
    points: 5,
    tokens: 5,
    description: 'Verified a public proof or document'
  },
  community_contribution: {
    action: 'community_contribution',
    points: 20,
    tokens: 20,
    description: 'Meaningful community contribution'
  }
};

export function getReputationLevel(points: number): string {
  if (points < 100) return 'Explorer';
  if (points < 500) return 'Analyst';
  if (points < 1000) return 'Verifier';
  if (points < 2500) return 'Specialist';
  if (points < 5000) return 'Trusted Analyst';
  return 'Expert';
}
