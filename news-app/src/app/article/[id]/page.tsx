import { ArticlePage } from '@/components/ArticlePage';
import { notFound } from 'next/navigation';
import { ApiService } from '@/lib/api';

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Article({ params }: ArticlePageProps) {
  // Await the params to handle dynamic routes correctly
  const { id } = await params;
  
  try {
    const response = await ApiService.getArticle(id);
    
    if (!response.success || !response.data) {
      notFound();
    }

    return <ArticlePage article={response.data} />;
  } catch (error) {
    console.error('Error fetching article:', error);
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    const response = await ApiService.getArticles({ limit: 100 });
    
    if (response.success && response.data) {
      return response.data.map((article) => ({
        id: article._id || article.id,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
