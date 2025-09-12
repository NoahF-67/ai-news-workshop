const NEWS_API_KEY = process.env.NEWS_API_KEY;

if (!NEWS_API_KEY) {
  throw new Error('Please define the NEWS_API_KEY environment variable inside .env.local');
}

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: any[];
}

class NewsAPIClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}): Promise<NewsAPIResponse> {
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

  async getTopHeadlines(params: {
    country?: string;
    category?: string;
    sources?: string;
    q?: string;
    pageSize?: number;
    page?: number;
  } = {}): Promise<NewsAPIResponse> {
    return this.makeRequest('/top-headlines', params);
  }

  async getEverything(params: {
    q?: string;
    qInTitle?: string;
    sources?: string;
    domains?: string;
    excludeDomains?: string;
    from?: string;
    to?: string;
    language?: string;
    sortBy?: string;
    pageSize?: number;
    page?: number;
  } = {}): Promise<NewsAPIResponse> {
    return this.makeRequest('/everything', params);
  }

  async getSources(params: {
    category?: string;
    language?: string;
    country?: string;
  } = {}): Promise<any> {
    return this.makeRequest('/sources', params);
  }
}

// Create and export the client instance
const newsapi = new NewsAPIClient(NEWS_API_KEY);

export default newsapi;
