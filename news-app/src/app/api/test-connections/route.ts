import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import newsapi from '@/lib/newsapi-custom';
import { model } from '@/lib/gemini';

export async function GET() {
  const results = {
    mongodb: { connected: false, error: null as string | null },
    newsapi: { connected: false, error: null as string | null },
    gemini: { connected: false, error: null as string | null },
    environment: { loaded: false, error: null as string | null }
  };

  // Test MongoDB connection
  try {
    await connectDB();
    results.mongodb.connected = true;
  } catch (error) {
    results.mongodb.error = error instanceof Error ? error.message : 'Unknown error';
  }

  // Test News API connection
  try {
    // Test with a simple request
    const response = await newsapi.getTopHeadlines({
      country: 'us',
      pageSize: 1
    });
    results.newsapi.connected = true;
  } catch (error) {
    results.newsapi.error = error instanceof Error ? error.message : 'Unknown error';
  }

  // Test Gemini API connection
  try {
    // Test with a simple prompt
    const result = await model.generateContent('Hello, this is a test connection.');
    await result.response;
    results.gemini.connected = true;
  } catch (error) {
    results.gemini.error = error instanceof Error ? error.message : 'Unknown error';
  }

  // Test environment variables
  try {
    const requiredEnvVars = ['MONGODB_URI', 'NEWS_API_KEY', 'GOOGLE_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length === 0) {
      results.environment.loaded = true;
    } else {
      results.environment.error = `Missing environment variables: ${missingVars.join(', ')}`;
    }
  } catch (error) {
    results.environment.error = error instanceof Error ? error.message : 'Unknown error';
  }

  const allConnected = results.mongodb.connected && 
                      results.newsapi.connected && 
                      results.gemini.connected && 
                      results.environment.loaded;

  return NextResponse.json({
    success: allConnected,
    message: allConnected ? 'All services connected successfully!' : 'Some services failed to connect.',
    results
  });
}
