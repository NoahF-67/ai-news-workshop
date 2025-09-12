const { GoogleGenerativeAI } = require('@google/generative-ai');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  throw new Error('Please define the GOOGLE_API_KEY environment variable inside .env.local');
}

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// Get the Gemini model
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

module.exports = { genAI, model };
