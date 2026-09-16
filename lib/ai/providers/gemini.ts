import { GoogleGenerativeAI } from '@google/generative-ai';
import { analysisResultSchema, cvGenerationSchema } from '../schemas';
import { AGENT_PROMPTS, GENERATE_CV_PROMPT } from '../prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

export async function runAgentAnalysis(agentType: string, textContent: string, isImage: boolean = false) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const promptTemplate = AGENT_PROMPTS[agentType];
  if (!promptTemplate) {
    throw new Error(`Unknown agent type: ${agentType}`);
  }

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: analysisResultSchema,
    },
  });

  const parts: any[] = [{ text: promptTemplate }];

  if (isImage) {
    parts.push({
      inlineData: {
        data: textContent, // Assuming base64 format without prefix
        mimeType: 'image/jpeg', 
      },
    });
  } else {
    parts.push({ text: `\n\n--- EVIDENCE / INPUT ---\n${textContent}` });
  }

  let responseText = '';
  let attempt = 0;
  let maxAttempts = 3;

  while (attempt < maxAttempts) {
    try {
      const result = await model.generateContent(parts);
      responseText = result.response.text();
      break;
    } catch (e: any) {
      attempt++;
      if (e.message?.includes('503') && attempt < maxAttempts) {
        // Wait 1.5 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
      } else {
        throw e;
      }
    }
  }
  
  try {
    return JSON.parse(responseText);
  } catch (e) {
    throw new Error('Failed to parse Gemini response as JSON');
  }
}

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
