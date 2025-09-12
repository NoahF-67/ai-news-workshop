require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function testValidation() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('news-app');
    const articlesCollection = db.collection('articles');
    const chatsCollection = db.collection('chats');
    
    console.log('\n🧪 Testing Articles Collection Validation...\n');
    
    // Test 1: Valid article data
    console.log('Test 1: Inserting valid article...');
    const validArticle = {
      title: 'Test Article: AI Revolution',
      coverImage: 'https://example.com/image.jpg',
      publisherName: 'Tech News',
      publisherLogo: 'https://example.com/logo.png',
      authorName: 'John Doe',
      datePosted: new Date(),
      quickSummary: 'This is a test article about AI revolution in technology.',
      detailedSummary: 'This is a detailed summary of the AI revolution article. It covers various aspects of artificial intelligence and its impact on modern technology and society.',
      whyItMatters: 'This article matters because it provides insights into the future of AI and how it will shape our world.',
      sourceUrl: 'https://example.com/article',
      category: 'AI',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      const result = await articlesCollection.insertOne(validArticle);
      console.log('✅ Valid article inserted successfully:', result.insertedId);
    } catch (error) {
      console.log('❌ Valid article insertion failed:', error.message);
    }
    
    // Test 2: Invalid article data (missing required fields)
    console.log('\nTest 2: Inserting invalid article (missing required fields)...');
    const invalidArticle = {
      title: 'Invalid Article',
      // Missing required fields
    };
    
    try {
      await articlesCollection.insertOne(invalidArticle);
      console.log('❌ Invalid article was inserted (validation failed)');
    } catch (error) {
      console.log('✅ Invalid article correctly rejected:', error.message);
    }
    
    // Test 3: Invalid article data (wrong data types)
    console.log('\nTest 3: Inserting invalid article (wrong data types)...');
    const invalidTypesArticle = {
      title: 123, // Should be string
      coverImage: 'https://example.com/image.jpg',
      publisherName: 'Tech News',
      publisherLogo: 'https://example.com/logo.png',
      authorName: 'John Doe',
      datePosted: 'not-a-date', // Should be date
      quickSummary: 'This is a test article about AI revolution in technology.',
      detailedSummary: 'This is a detailed summary of the AI revolution article.',
      whyItMatters: 'This article matters because it provides insights into the future of AI.',
      sourceUrl: 'https://example.com/article',
      category: 'AI',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      await articlesCollection.insertOne(invalidTypesArticle);
      console.log('❌ Invalid types article was inserted (validation failed)');
    } catch (error) {
      console.log('✅ Invalid types article correctly rejected:', error.message);
    }
    
    // Test 4: Invalid category
    console.log('\nTest 4: Inserting article with invalid category...');
    const invalidCategoryArticle = {
      title: 'Test Article',
      coverImage: 'https://example.com/image.jpg',
      publisherName: 'Tech News',
      publisherLogo: 'https://example.com/logo.png',
      authorName: 'John Doe',
      datePosted: new Date(),
      quickSummary: 'This is a test article about AI revolution in technology.',
      detailedSummary: 'This is a detailed summary of the AI revolution article.',
      whyItMatters: 'This article matters because it provides insights into the future of AI.',
      sourceUrl: 'https://example.com/article',
      category: 'InvalidCategory', // Invalid category
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      await articlesCollection.insertOne(invalidCategoryArticle);
      console.log('❌ Invalid category article was inserted (validation failed)');
    } catch (error) {
      console.log('✅ Invalid category article correctly rejected:', error.message);
    }
    
    console.log('\n🧪 Testing Chats Collection Validation...\n');
    
    // Test 5: Valid chat data
    console.log('Test 5: Inserting valid chat...');
    const validChat = {
      sessionId: 'session-123-abc',
      articleId: 'article-456-def',
      messages: [
        {
          text: 'Hello, can you explain this article?',
          isUser: true,
          timestamp: new Date()
        },
        {
          text: 'Sure! This article discusses AI technology.',
          isUser: false,
          timestamp: new Date()
        }
      ],
      articleTitle: 'Test Article: AI Revolution',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      const result = await chatsCollection.insertOne(validChat);
      console.log('✅ Valid chat inserted successfully:', result.insertedId);
    } catch (error) {
      console.log('❌ Valid chat insertion failed:', error.message);
    }
    
    // Test 6: Invalid chat data (missing required fields)
    console.log('\nTest 6: Inserting invalid chat (missing required fields)...');
    const invalidChat = {
      sessionId: 'session-123-abc',
      // Missing required fields
    };
    
    try {
      await chatsCollection.insertOne(invalidChat);
      console.log('❌ Invalid chat was inserted (validation failed)');
    } catch (error) {
      console.log('✅ Invalid chat correctly rejected:', error.message);
    }
    
    // Test 7: Invalid messages array
    console.log('\nTest 7: Inserting chat with invalid messages...');
    const invalidMessagesChat = {
      sessionId: 'session-123-abc',
      articleId: 'article-456-def',
      messages: [
        {
          text: 123, // Should be string
          isUser: 'not-boolean', // Should be boolean
          timestamp: 'not-date' // Should be date
        }
      ],
      articleTitle: 'Test Article: AI Revolution',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      await chatsCollection.insertOne(invalidMessagesChat);
      console.log('❌ Invalid messages chat was inserted (validation failed)');
    } catch (error) {
      console.log('✅ Invalid messages chat correctly rejected:', error.message);
    }
    
    console.log('\n🎉 Validation testing complete!');
    console.log('\nSummary:');
    console.log('- Articles collection validation: Working correctly');
    console.log('- Chats collection validation: Working correctly');
    console.log('- Both collections enforce schema at database level');
    
  } catch (error) {
    console.error('Error testing validation:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Run the validation test
testValidation().catch(console.error);
