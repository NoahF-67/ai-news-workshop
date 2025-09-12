import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    
    await connectDB();
    const { default: mongoose } = await import('mongoose');
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error('Database connection failed');
    }
    
    const articlesCollection = db.collection('articles');
    
    // Build query
    const query = category && category !== 'All' ? { category } : {};
    
    // Get total count for pagination
    const totalCount = await articlesCollection.countDocuments(query);
    
    // Fetch articles with pagination
    const articles = await articlesCollection
      .find(query)
      .sort({ datePosted: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch articles',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
