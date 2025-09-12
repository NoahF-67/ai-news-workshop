require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function debugValidation() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db('news-app');
    const articlesCollection = db.collection('articles');
    
    // Get validation rules
    const collections = await db.listCollections().toArray();
    const articlesCollectionInfo = collections.find(c => c.name === 'articles');
    
    if (articlesCollectionInfo && articlesCollectionInfo.options && articlesCollectionInfo.options.validator) {
      console.log('\n📋 Articles collection validation rules:');
      console.log(JSON.stringify(articlesCollectionInfo.options.validator, null, 2));
    }
    
    // Try to insert a test document to see what validation fails
    const testDoc = {
      title: 'Test Article',
      coverImage: 'https://example.com/image.jpg',
      publisherName: 'Test Publisher',
      publisherLogo: 'https://example.com/logo.jpg',
      authorName: 'Test Author',
      datePosted: new Date(),
      quickSummary: 'Test summary',
      detailedSummary: 'Test detailed summary',
      whyItMatters: 'Test why it matters',
      sourceUrl: 'https://example.com/article',
      category: 'Technology',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('\n🧪 Testing document validation...');
    console.log('Test document:', JSON.stringify(testDoc, null, 2));
    
    try {
      await articlesCollection.insertOne(testDoc);
      console.log('✅ Test document inserted successfully');
      
      // Clean up test document
      await articlesCollection.deleteOne({ title: 'Test Article' });
      console.log('✅ Test document cleaned up');
    } catch (error) {
      console.log('❌ Test document validation failed:');
      console.log('Error:', error.message);
      if (error.writeErrors && error.writeErrors[0]) {
        console.log('Write error details:', JSON.stringify(error.writeErrors[0], null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Error debugging validation:', error);
  } finally {
    await client.close();
  }
}

debugValidation();
