require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function setupDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('news-app');
    
    // Create articles collection with validation
    console.log('Creating articles collection...');
    await db.createCollection('articles', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: [
            'title',
            'coverImage',
            'publisherName',
            'publisherLogo',
            'authorName',
            'datePosted',
            'quickSummary',
            'detailedSummary',
            'whyItMatters',
            'sourceUrl',
            'category',
            'createdAt',
            'updatedAt'
          ],
          properties: {
            title: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 500,
              description: 'Article title must be a string between 1 and 500 characters'
            },
            coverImage: {
              bsonType: 'string',
              pattern: '^https?://',
              description: 'Cover image must be a valid URL'
            },
            publisherName: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'Publisher name must be a string between 1 and 100 characters'
            },
            publisherLogo: {
              bsonType: 'string',
              pattern: '^https?://',
              description: 'Publisher logo must be a valid URL'
            },
            authorName: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'Author name must be a string between 1 and 100 characters'
            },
            datePosted: {
              bsonType: 'date',
              description: 'Date posted must be a valid date'
            },
            quickSummary: {
              bsonType: 'string',
              minLength: 10,
              maxLength: 500,
              description: 'Quick summary must be a string between 10 and 500 characters'
            },
            detailedSummary: {
              bsonType: 'string',
              minLength: 50,
              maxLength: 5000,
              description: 'Detailed summary must be a string between 50 and 5000 characters'
            },
            whyItMatters: {
              bsonType: 'string',
              minLength: 20,
              maxLength: 2000,
              description: 'Why it matters must be a string between 20 and 2000 characters'
            },
            sourceUrl: {
              bsonType: 'string',
              pattern: '^https?://',
              description: 'Source URL must be a valid URL'
            },
            category: {
              bsonType: 'string',
              enum: ['AI', 'Technology', 'Startups', 'Funding', 'Machine Learning'],
              description: 'Category must be one of the allowed values'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Created at must be a valid date'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Updated at must be a valid date'
            }
          }
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    });
    console.log('✅ Articles collection created with validation');
    
    // Create chats collection with validation
    console.log('Creating chats collection...');
    await db.createCollection('chats', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: [
            'sessionId',
            'articleId',
            'messages',
            'articleTitle',
            'createdAt',
            'updatedAt'
          ],
          properties: {
            sessionId: {
              bsonType: 'string',
              minLength: 10,
              maxLength: 100,
              description: 'Session ID must be a string between 10 and 100 characters'
            },
            articleId: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 100,
              description: 'Article ID must be a string between 1 and 100 characters'
            },
            messages: {
              bsonType: 'array',
              minItems: 0,
              items: {
                bsonType: 'object',
                required: ['text', 'isUser', 'timestamp'],
                properties: {
                  text: {
                    bsonType: 'string',
                    minLength: 1,
                    maxLength: 2000,
                    description: 'Message text must be a string between 1 and 2000 characters'
                  },
                  isUser: {
                    bsonType: 'bool',
                    description: 'isUser must be a boolean'
                  },
                  timestamp: {
                    bsonType: 'date',
                    description: 'Timestamp must be a valid date'
                  }
                }
              },
              description: 'Messages must be an array of message objects'
            },
            articleTitle: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 500,
              description: 'Article title must be a string between 1 and 500 characters'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Created at must be a valid date'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Updated at must be a valid date'
            }
          }
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    });
    console.log('✅ Chats collection created with validation');
    
    // Create indexes for better performance
    console.log('Creating indexes...');
    
    // Articles collection indexes
    await db.collection('articles').createIndex({ category: 1 });
    await db.collection('articles').createIndex({ datePosted: -1 });
    await db.collection('articles').createIndex({ sourceUrl: 1 }, { unique: true });
    await db.collection('articles').createIndex({ createdAt: -1 });
    
    // Chats collection indexes
    await db.collection('chats').createIndex({ sessionId: 1 });
    await db.collection('chats').createIndex({ articleId: 1 });
    await db.collection('chats').createIndex({ createdAt: -1 });
    
    console.log('✅ Indexes created');
    
    console.log('\n🎉 Database setup complete!');
    console.log('Collections created:');
    console.log('- articles (with validation)');
    console.log('- chats (with validation)');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Run the setup
setupDatabase().catch(console.error);
