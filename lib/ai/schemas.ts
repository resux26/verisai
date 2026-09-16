import { SchemaType, ResponseSchema } from '@google/generative-ai';

export const analysisResultSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    verdict: { 
      type: SchemaType.STRING, 
      description: "The final verdict. E.g., 'HIGH CONCERN', 'FAIR VALUE', 'LOW RISK'." 
    },
    confidence: { 
      type: SchemaType.INTEGER, 
      description: "Confidence score from 0 to 100." 
    },
    summary: { 
      type: SchemaType.STRING, 
      description: "A short summary of the AI's assessment." 
    },
    extractedFacts: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: "Objective facts extracted from the input."
    },
    positiveSignals: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: "Signals that increase trust, value, or safety."
    },
    concernSignals: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: "Red flags, warnings, or negative signals."
    },
    missingInformation: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: "Crucial context or data that was not provided in the input."
    },
    recommendations: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: "Recommended next steps or actions for the user."
    },
    questionsForUser: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: "Questions the user should ask the seller, employer, or themselves to clarify the situation."
    },
    disclaimer: { 
      type: SchemaType.STRING, 
      description: "A legal/informational disclaimer specific to this agent type." 
    },
  },
  required: [
    "verdict", 
    "confidence", 
    "summary", 
    "extractedFacts", 
    "positiveSignals", 
    "concernSignals", 
    "missingInformation", 
    "recommendations", 
    "questionsForUser", 
    "disclaimer"
  ],
};

// We will keep cvGenerationSchema for the CV Builder functionality
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
        required: ["institution", "degree"]
      }
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
        required: ["company", "role"]
      }
    },
    skills: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
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
        required: ["name", "description"]
      }
    }
  },
  required: ["name", "title", "summary", "skills"],
};
