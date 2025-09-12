require('dotenv').config({ path: '.env.local' });
const NewsPipeline = require('../lib/news-pipeline');

async function runPipeline() {
  console.log('🎯 News Pipeline Execution');
  console.log('========================\n');
  
  const pipeline = new NewsPipeline();
  
  try {
    const articles = await pipeline.execute();
    
    console.log('\n📋 Pipeline Results:');
    console.log('===================');
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Category: ${article.category}`);
      console.log(`   Publisher: ${article.publisherName}`);
      console.log(`   URL: ${article.sourceUrl}`);
      console.log('');
    });
    
    console.log('✅ Pipeline completed successfully!');
    console.log(`📊 Total articles processed: ${articles.length}`);
    console.log('🔍 Check your MongoDB Atlas dashboard to verify the articles collection');
    
  } catch (error) {
    console.error('❌ Pipeline execution failed:', error);
    process.exit(1);
  }
}

// Run the pipeline
runPipeline();
