import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to handle dynamic routes correctly
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    const { default: mongoose } = await import('mongoose');
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error('Database connection failed');
    }
    
    const articlesCollection = db.collection('articles');
    
    // Find article by ID
    const article = await articlesCollection.findOne({ _id: new mongoose.Types.ObjectId(id) });
    
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: article
    });
    
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch article',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
