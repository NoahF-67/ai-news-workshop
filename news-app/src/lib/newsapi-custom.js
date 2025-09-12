const NEWS_API_KEY = process.env.NEWS_API_KEY;

if (!NEWS_API_KEY) {
  throw new Error('Please define the NEWS_API_KEY environment variable inside .env.local');
}

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

class NewsAPIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async makeRequest(endpoint, params = {}) {
    const url = new URL(`${NEWS_API_BASE_URL}${endpoint}`);
    
    // Add API key
    url.searchParams.append('apiKey', this.apiKey);
    
    // Add other parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`News API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getTopHeadlines(params = {}) {
    return this.makeRequest('/top-headlines', params);
  }

  async getEverything(params = {}) {
    return this.makeRequest('/everything', params);
  }

  async getSources(params = {}) {
    return this.makeRequest('/sources', params);
  }
}

// Create and export the client instance
const newsapi = new NewsAPIClient(NEWS_API_KEY);

module.exports = newsapi;
