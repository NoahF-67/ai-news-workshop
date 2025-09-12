import NewsAPI from 'newsapi';

const NEWS_API_KEY = process.env.NEWS_API_KEY;

if (!NEWS_API_KEY) {
  throw new Error('Please define the NEWS_API_KEY environment variable inside .env.local');
}

// Initialize NewsAPI client with fetch polyfill for Node.js
const newsapi = new NewsAPI(NEWS_API_KEY);

export default newsapi;
