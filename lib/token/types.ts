export type RewardAction = 
  | 'profile_completed'
  | 'analysis_completed'
  | 'public_analysis'
  | 'template_uploaded'
  | 'template_published'
  | 'proof_created'
  | 'verification_completed'
  | 'community_contribution';

export interface RewardRule {
  action: RewardAction;
  points: number; // Reputation points
  tokens: number; // CRX demo tokens
  description: string;
}
