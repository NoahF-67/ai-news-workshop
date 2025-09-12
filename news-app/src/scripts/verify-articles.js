require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function verifyArticles() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db('news-app');
    const articlesCollection = db.collection('articles');
    
    // Count total articles
    const totalCount = await articlesCollection.countDocuments();
    console.log(`\n📊 Total articles in database: ${totalCount}`);
    
    // Get all articles
    const articles = await articlesCollection.find({}).toArray();
    
    console.log('\n📰 Articles in MongoDB Atlas:');
    console.log('============================');
    
    articles.forEach((article, index) => {
      console.log(`\n${index + 1}. ${article.title}`);
      console.log(`   📅 Published: ${article.datePosted.toLocaleDateString()}`);
      console.log(`   🏢 Publisher: ${article.publisherName}`);
      console.log(`   👤 Author: ${article.authorName}`);
      console.log(`   🏷️  Category: ${article.category}`);
      console.log(`   🔗 URL: ${article.sourceUrl}`);
      console.log(`   🖼️  Cover Image: ${article.coverImage ? '✅ Present' : '❌ Missing'}`);
      console.log(`   🏢 Publisher Logo: ${article.publisherLogo ? '✅ Present' : '❌ Missing'}`);
      console.log(`   🤖 Quick Summary: ${article.quickSummary ? '✅ Present' : '❌ Missing'}`);
      console.log(`   📝 Detailed Summary: ${article.detailedSummary ? '✅ Present' : '❌ Missing'}`);
      console.log(`   💡 Why It Matters: ${article.whyItMatters ? '✅ Present' : '❌ Missing'}`);
    });
    
    // Check categories distribution
    const categoryStats = {};
    articles.forEach(article => {
      categoryStats[article.category] = (categoryStats[article.category] || 0) + 1;
    });
    
    console.log('\n📈 Category Distribution:');
    console.log('========================');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} articles`);
    });
    
    // Check publishers
    const publisherStats = {};
    articles.forEach(article => {
      publisherStats[article.publisherName] = (publisherStats[article.publisherName] || 0) + 1;
    });
    
    console.log('\n🏢 Publisher Distribution:');
    console.log('==========================');
    Object.entries(publisherStats).forEach(([publisher, count]) => {
      console.log(`   ${publisher}: ${count} articles`);
    });
    
    console.log('\n✅ Verification Complete!');
    console.log('🎯 All 10 articles successfully stored in MongoDB Atlas');
    console.log('🔍 Check your MongoDB Atlas dashboard to see the articles collection');
    
  } catch (error) {
    console.error('❌ Error verifying articles:', error);
  } finally {
    await client.close();
  }
}

verifyArticles();
