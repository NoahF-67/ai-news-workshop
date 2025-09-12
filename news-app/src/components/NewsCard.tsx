'use client';

import { NewsArticle } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
    <Link href={`/article/${article._id || article.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md hover:shadow-xl">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={article.coverImage}
            alt={article.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge className={`${getCategoryColor(article.category)} border-0`}>
              {article.category}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg leading-tight mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {article.quickSummary}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={article.publisherLogo} alt={article.publisherName} />
              <AvatarFallback className="text-xs">
                {article.publisherName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-900">{article.publisherName}</span>
              <div className="flex items-center text-xs text-gray-500">
                <User className="h-3 w-3 mr-1" />
                <span className="truncate max-w-20">{article.authorName}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(article.datePosted)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
