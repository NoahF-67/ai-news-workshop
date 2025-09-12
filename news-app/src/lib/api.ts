import { NewsArticle } from '@/types';

const API_BASE_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface ArticlesResponse {
  success: boolean;
  data: NewsArticle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ArticleResponse {
  success: boolean;
  data: NewsArticle;
}

export class ApiService {
  private static async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      console.log('Fetching from URL:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async getArticles(params?: {
    category?: string;
    limit?: number;
    page?: number;
  }): Promise<ArticlesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.category) searchParams.append('category', params.category);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    
    const url = `${API_BASE_URL}/api/articles?${searchParams.toString()}`;
    return this.fetchWithErrorHandling<ArticlesResponse>(url);
  }

  static async getArticle(id: string): Promise<ArticleResponse> {
    const url = `${API_BASE_URL}/api/articles/${id}`;
    return this.fetchWithErrorHandling<ArticleResponse>(url);
  }
}
