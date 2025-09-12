'use client';

import { NewsArticle } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, User, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Chatbot } from './Chatbot';

interface ArticlePageProps {
  article: NewsArticle;
}

export function ArticlePage({ article }: ArticlePageProps) {
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'AI': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'Technology': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'Startups': 'bg-green-100 text-green-800 hover:bg-green-200',
      'Funding': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      'Machine Learning': 'bg-pink-100 text-pink-800 hover:bg-pink-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute top-6 left-6">
            <Badge className={`${getCategoryColor(article.category)} border-0 text-sm px-3 py-1`}>
              {article.category}
            </Badge>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Publisher Info */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={article.publisherLogo} alt={article.publisherName} />
                <AvatarFallback className="text-lg">
                  {article.publisherName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{article.publisherName}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-1" />
                  <span>{article.authorName}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(article.datePosted)}</span>
            </div>
            </div>
          </CardContent>
        </Card>

        {/* AI-Generated Summary */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI-Generated Summary</h2>
            <div className="prose prose-lg max-w-none">
              {article.detailedSummary.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Why it Matters Section */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                !
              </span>
              Why it Matters
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {article.whyItMatters}
            </p>
          </CardContent>
        </Card>

        {/* Read Original Button */}
        <div className="text-center mb-12">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
          >
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-5 w-5" />
              <span>Read Original Article</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot articleId={article.id} articleTitle={article.title} />
    </div>
  );
}
