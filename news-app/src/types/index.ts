export interface NewsArticle {
  _id?: string; // MongoDB ObjectId
  id?: string; // Fallback for compatibility
  title: string;
  coverImage: string;
  publisherName: string;
  publisherLogo: string;
  authorName: string;
  datePosted: string | Date;
  category: 'AI' | 'Technology' | 'Startups' | 'Funding' | 'Machine Learning';
  quickSummary: string;
  detailedSummary: string;
  whyItMatters: string;
  sourceUrl: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}
