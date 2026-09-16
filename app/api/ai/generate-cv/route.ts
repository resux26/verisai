import { NextResponse } from 'next/server';
import { generateCV } from '@/lib/ai/aiClient';
import { DEMO_CV_DATA } from '@/lib/demo/sampleData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userInput, jobDescription } = body;

    if (!userInput) {
      return NextResponse.json({ error: 'User input is required' }, { status: 400 });
    }

    // In demo mode without API key, return mock data
    if (!process.env.GEMINI_API_KEY) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json(DEMO_CV_DATA);
    }

    const result = await generateCV(userInput, jobDescription);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error generating CV:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate CV' },
      { status: 500 }
    );
  }
}
