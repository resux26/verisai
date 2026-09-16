import { runAgentAnalysis as runGeminiAnalysis, generateCVWithGemini } from './providers/gemini';

const provider = process.env.AI_PROVIDER || 'gemini';

export async function runAgentAnalysis(agentType: string, textContent: string, isImage: boolean = false) {
  if (provider === 'gemini') {
    return runGeminiAnalysis(agentType, textContent, isImage);
  }
  throw new Error(`Unsupported AI provider: ${provider}`);
}

export async function generateCV(userInput: string, jobDescription?: string) {
  if (provider === 'gemini') {
    return generateCVWithGemini(userInput, jobDescription);
  }
  throw new Error(`Unsupported AI provider: ${provider}`);
}
