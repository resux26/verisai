import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAgentSchema, cvGenerationSchema } from '../schemas';
import { AGENT_PROMPTS, GENERATE_CV_PROMPT } from '../prompts';
import { isValidAgentId } from '@/lib/agents/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

/**
 * Run an agent-specific analysis using Gemini.
 * Each agent type gets its own schema and prompt, producing
 * a uniquely structured intelligence report.
 */
export async function runAgentAnalysis(agentType: string, textContent: string, isImage: boolean = false) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  if (!isValidAgentId(agentType)) {
    throw new Error(`Unknown agent type: ${agentType}`);
  }

  const promptTemplate = AGENT_PROMPTS[agentType];
  if (!promptTemplate) {
    throw new Error(`No prompt defined for agent: ${agentType}`);
  }

  // Use the agent-specific schema for structured output
  const agentSchema = getAgentSchema(agentType);

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: agentSchema,
    },
  });

  const parts: any[] = [{ text: promptTemplate }];

  if (isImage) {
    parts.push({
      inlineData: {
        data: textContent,
        mimeType: 'image/jpeg',
      },
    });
  } else {
    parts.push({ text: `\n\n--- EVIDENCE / INPUT ---\n${textContent}` });
  }

  let responseText = '';
  let attempt = 0;
  const maxAttempts = 3;

  while (attempt < maxAttempts) {
    try {
      const result = await model.generateContent(parts);
      responseText = result.response.text();
      break;
    } catch (e: any) {
      attempt++;
      if (e.message?.includes('503') && attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
      } else {
        throw e;
      }
    }
  }

  try {
    const parsed = JSON.parse(responseText);
    // Tag the result with the agent type for downstream components
    parsed._agentType = agentType;
    return parsed;
  } catch (e) {
    throw new Error('Failed to parse Gemini response as JSON');
  }
}

/**
 * Generate a CV using Gemini.
 * Uses the dedicated CV generation schema (not an agent analysis).
 */
export async function generateCVWithGemini(userInput: string, jobDescription?: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: cvGenerationSchema,
    },
  });

  let prompt = GENERATE_CV_PROMPT + `\n\n--- USER INPUT ---\n${userInput}`;

  if (jobDescription) {
    prompt += `\n\n--- TARGET JOB DESCRIPTION ---\n${jobDescription}`;
  }

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  try {
    return JSON.parse(responseText);
  } catch (e) {
    throw new Error('Failed to parse Gemini response as JSON');
  }
}
