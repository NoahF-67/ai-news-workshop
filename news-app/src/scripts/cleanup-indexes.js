require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function cleanupIndexes() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db('news-app');
    const articlesCollection = db.collection('articles');
    const chatsCollection = db.collection('chats');
    
    console.log('\n🔍 Current indexes:');
    
    // Check articles collection indexes
    console.log('\n📰 Articles collection indexes:');
    const articlesIndexes = await articlesCollection.indexes();
    articlesIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Check chats collection indexes
    console.log('\n💬 Chats collection indexes:');
    const chatsIndexes = await chatsCollection.indexes();
    chatsIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Check for duplicate indexes
    const duplicateIndexes = [];
    
    // Check articles collection for duplicates
    const articlesIndexNames = articlesIndexes.map(idx => idx.name);
    const articlesDuplicates = articlesIndexNames.filter((name, index) => 
      articlesIndexNames.indexOf(name) !== index
    );
    
    if (articlesDuplicates.length > 0) {
      duplicateIndexes.push(...articlesDuplicates);
      console.log('\n⚠️  Duplicate indexes found in articles collection:', articlesDuplicates);
    }
    
    // Check chats collection for duplicates
    const chatsIndexNames = chatsIndexes.map(idx => idx.name);
    const chatsDuplicates = chatsIndexNames.filter((name, index) => 
      chatsIndexNames.indexOf(name) !== index
    );
    
    if (chatsDuplicates.length > 0) {
      duplicateIndexes.push(...chatsDuplicates);
      console.log('\n⚠️  Duplicate indexes found in chats collection:', chatsDuplicates);
    }
    
    if (duplicateIndexes.length === 0) {
      console.log('\n✅ No duplicate indexes found. Database is clean!');
    } else {
      console.log('\n🧹 Cleaning up duplicate indexes...');
      
      // Remove duplicate indexes
      for (const indexName of duplicateIndexes) {
        try {
          if (articlesIndexNames.includes(indexName)) {
            await articlesCollection.dropIndex(indexName);
            console.log(`  ✅ Removed duplicate index: ${indexName} from articles`);
          }
          if (chatsIndexNames.includes(indexName)) {
            await chatsCollection.dropIndex(indexName);
            console.log(`  ✅ Removed duplicate index: ${indexName} from chats`);
          }
        } catch (error) {
          console.log(`  ⚠️  Could not remove index ${indexName}: ${error.message}`);
        }
      }
    }
    
    console.log('\n🎉 Index cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error cleaning up indexes:', error);
  } finally {
    await client.close();
  }
}

cleanupIndexes();
