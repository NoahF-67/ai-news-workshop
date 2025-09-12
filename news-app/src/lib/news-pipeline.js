require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const newsapi = require('./newsapi-custom');
const { model } = require('./gemini');

const MONGODB_URI = process.env.MONGODB_URI;

// Top-tier tech sources
const TECH_SOURCES = [
  'techcrunch',
  'wired',
  'the-verge', 
  'ars-technica',
  'venturebeat',
  'engadget',
  'mashable',
  'recode',
  'the-next-web',
  'techradar'
];

// Categories to focus on
const TARGET_CATEGORIES = ['AI', 'Technology', 'Startups', 'Funding', 'Machine Learning'];

// Keywords to exclude (politics, war, defense)
const EXCLUDE_KEYWORDS = [
  'politics', 'political', 'war', 'defense', 'military', 'election', 'vote', 'government',
  'congress', 'senate', 'president', 'biden', 'trump', 'republican', 'democrat'
];

class NewsPipeline {
  constructor() {
    this.client = null;
    this.db = null;
    this.articlesCollection = null;
  }

  async connect() {
    this.client = new MongoClient(MONGODB_URI);
    await this.client.connect();
    this.db = this.client.db('news-app');
    this.articlesCollection = this.db.collection('articles');
    console.log('✅ Connected to MongoDB');
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('✅ Disconnected from MongoDB');
    }
  }

  // Check if article already exists
  async isDuplicate(sourceUrl) {
    const existing = await this.articlesCollection.findOne({ sourceUrl });
    return !!existing;
  }

  // Extract publisher logo from various sources
  getPublisherLogo(publisherName) {
    const logoMap = {
      'TechCrunch': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
      'Wired': 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=100&h=100&fit=crop',
      'The Verge': 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=100&h=100&fit=crop',
      'Ars Technica': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
      'VentureBeat': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
      'Engadget': 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=100&h=100&fit=crop',
      'Mashable': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
      'Recode': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
      'The Next Web': 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=100&h=100&fit=crop',
      'TechRadar': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop'
    };
    
    return logoMap[publisherName] || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop';
  }

  // Determine article category based on content
  determineCategory(title, description, content) {
    const text = `${title} ${description} ${content}`.toLowerCase();
    
    if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning') || text.includes('neural network')) {
      return 'AI';
    }
    if (text.includes('startup') || text.includes('funding') || text.includes('investment') || text.includes('venture capital')) {
      return 'Startups';
    }
    if (text.includes('funding') || text.includes('investment') || text.includes('funding round') || text.includes('series')) {
      return 'Funding';
    }
    if (text.includes('machine learning') || text.includes('deep learning') || text.includes('neural network') || text.includes('algorithm')) {
      return 'Machine Learning';
    }
    return 'Technology';
  }

  // Check if article should be excluded
  shouldExclude(title, description, content) {
    const text = `${title} ${description} ${content}`.toLowerCase();
    return EXCLUDE_KEYWORDS.some(keyword => text.includes(keyword));
  }

  // Generate AI content using Gemini with rate limiting
  async generateAIContent(article) {
    try {
      console.log(`🤖 Generating AI content for: ${article.title}`);
      
      // First, try to fetch the full article content
      let fullContent = '';
      try {
        console.log(`📄 Fetching full content from: ${article.url}`);
        const contentResponse = await fetch(article.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        if (contentResponse.ok) {
          const html = await contentResponse.text();
          // Simple text extraction (in production, you'd use a proper article extractor)
          const textMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) || 
                          html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                          html.match(/<div[^>]*class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                          html.match(/<div[^>]*class="[^"]*article[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
          
          if (textMatch) {
            // Remove HTML tags and clean up text
            fullContent = textMatch[1]
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .substring(0, 3000); // Limit to 3000 characters
            console.log(`✅ Extracted ${fullContent.length} characters of content`);
          }
        }
      } catch (contentError) {
        console.log(`⚠️  Could not fetch full content: ${contentError.message}`);
      }
      
      const prompt = `Generate three different summaries for this specific news article:

Title: ${article.title}
Description: ${article.description || 'No description available'}
Source: ${article.source?.name || 'Unknown'}
Published: ${article.publishedAt}
URL: ${article.url}

${fullContent ? `Full Article Content: ${fullContent}` : 'Note: Full content not available, using description only.'}

Please provide:

1. quickSummary: A single, concise sentence (15-25 words) that captures the key point of this specific article.

2. detailedSummary: Exactly two paragraphs in simple language (total 300-500 words) that explain what this specific article reports, who was involved, and the key details mentioned.

3. whyItMatters: A single paragraph (50-200 words) explaining why this specific development or news is significant for AI enthusiasts and technology learners, based on the actual content of the article.

IMPORTANT: 
- Base your summaries on the actual content of this specific article, not generic information
- Ensure quickSummary is at least 15 words long
- Ensure detailedSummary is at least 300 words long
- Ensure whyItMatters is at least 50 words long
- Use clean, simple language without special characters

Format your response as JSON with these exact keys: quickSummary, detailedSummary, whyItMatters`;

      // Add rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay between requests
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiContent = JSON.parse(jsonMatch[0]);
        
        // Validate and clean the content to meet MongoDB requirements
        const cleanContent = {
          quickSummary: this.cleanText(aiContent.quickSummary || article.description?.substring(0, 100) + '...' || 'Breaking news in technology.', 10, 500),
          detailedSummary: this.cleanText(aiContent.detailedSummary || `${article.description || 'This article covers important developments in technology.'}\n\n${article.content?.substring(0, 300) || 'The content discusses significant changes and innovations in the tech industry.'}...`, 50, 5000),
          whyItMatters: this.cleanText(aiContent.whyItMatters || 'This development is significant for AI enthusiasts and technology learners because it represents important progress in the field and could impact future innovations.', 20, 2000)
        };
        
        return cleanContent;
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    } catch (error) {
      console.error(`❌ Error generating AI content for ${article.title}:`, error.message);
      
      // Fallback content that meets validation requirements
      return {
        quickSummary: this.cleanText(article.description?.substring(0, 100) + '...' || 'Breaking news in technology.', 10, 500),
        detailedSummary: this.cleanText(`${article.description || 'This article covers important developments in technology.'}\n\n${article.content?.substring(0, 300) || 'The content discusses significant changes and innovations in the tech industry.'}...`, 50, 5000),
        whyItMatters: this.cleanText('This development is significant for AI enthusiasts and technology learners because it represents important progress in the field and could impact future innovations.', 20, 2000)
      };
    }
  }

  // Clean text to meet MongoDB validation requirements
  cleanText(text, minLength, maxLength) {
    if (!text) return 'Content not available';
    
    // Remove control characters and clean up
    let cleaned = text
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Ensure minimum length
    if (cleaned.length < minLength) {
      cleaned = cleaned + ' '.repeat(minLength - cleaned.length + 1);
    }
    
    // Ensure maximum length
    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength - 3) + '...';
    }
    
    return cleaned;
  }

  // Process a single article
  async processArticle(article) {
    try {
      // Check if article should be excluded
      if (this.shouldExclude(article.title, article.description, article.content)) {
        console.log(`❌ Excluding article: ${article.title} (contains excluded keywords)`);
        return null;
      }

      // Check for duplicates
      if (await this.isDuplicate(article.url)) {
        console.log(`❌ Duplicate article: ${article.title}`);
        return null;
      }

      console.log(`🔄 Processing: ${article.title}`);

      // Determine category
      const category = this.determineCategory(article.title, article.description, article.content);

      // Get publisher logo
      const publisherLogo = this.getPublisherLogo(article.source.name);

      // Generate AI content
      console.log(`🤖 Generating AI content for: ${article.title}`);
      const aiContent = await this.generateAIContent(article);

      // Create article document
      const articleDoc = {
        title: article.title,
        coverImage: article.urlToImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
        publisherName: article.source.name,
        publisherLogo: publisherLogo,
        authorName: article.author || 'Unknown Author',
        datePosted: new Date(article.publishedAt),
        quickSummary: aiContent.quickSummary,
        detailedSummary: aiContent.detailedSummary,
        whyItMatters: aiContent.whyItMatters,
        sourceUrl: article.url,
        category: category,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return articleDoc;
    } catch (error) {
      console.error(`Error processing article ${article.title}:`, error);
      return null;
    }
  }

  // Fetch articles from News API
  async fetchArticles() {
    console.log('📡 Fetching articles from News API...');
    
    const allArticles = [];
    
    // Try different approaches to get articles
    try {
      // Method 1: Get articles from specific sources
      console.log('🔍 Fetching from tech sources...');
      const sourcesResponse = await newsapi.getEverything({
        sources: TECH_SOURCES.join(','),
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20
      });
      
      if (sourcesResponse.articles) {
        allArticles.push(...sourcesResponse.articles);
      }
    } catch (error) {
      console.log('⚠️ Sources method failed, trying categories...');
    }

    try {
      // Method 2: Get articles by categories
      console.log('🔍 Fetching by categories...');
      const categoriesResponse = await newsapi.getTopHeadlines({
        category: 'technology',
        country: 'us',
        pageSize: 20
      });
      
      if (categoriesResponse.articles) {
        allArticles.push(...categoriesResponse.articles);
      }
    } catch (error) {
      console.log('⚠️ Categories method failed, trying general tech search...');
    }

    try {
      // Method 3: Search for tech keywords
      console.log('🔍 Searching for tech keywords...');
      const searchResponse = await newsapi.getEverything({
        q: 'technology OR AI OR artificial intelligence OR startup OR funding OR machine learning',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20
      });
      
      if (searchResponse.articles) {
        allArticles.push(...searchResponse.articles);
      }
    } catch (error) {
      console.log('⚠️ Search method failed:', error.message);
    }

    // Remove duplicates and filter
    const uniqueArticles = allArticles.filter((article, index, self) => 
      index === self.findIndex(a => a.url === article.url)
    );

    console.log(`📊 Found ${uniqueArticles.length} unique articles`);
    return uniqueArticles;
  }

  // Clear existing articles and insert new ones
  async replaceArticles(newArticles) {
    console.log('🗑️ Clearing existing articles...');
    await this.articlesCollection.deleteMany({});
    
    console.log(`💾 Inserting ${newArticles.length} new articles...`);
    const result = await this.articlesCollection.insertMany(newArticles);
    
    console.log(`✅ Successfully inserted ${result.insertedCount} articles`);
    return result;
  }

  // Main pipeline execution
  async execute() {
    try {
      console.log('🚀 Starting News Pipeline...\n');
      
      await this.connect();
      
      // Fetch articles
      const rawArticles = await this.fetchArticles();
      
      if (rawArticles.length === 0) {
        throw new Error('No articles fetched from News API');
      }

      // Process articles
      console.log(`\n🔄 Processing ${rawArticles.length} articles...`);
      const processedArticles = [];
      
      for (let i = 0; i < rawArticles.length && processedArticles.length < 10; i++) {
        const article = rawArticles[i];
        const processed = await this.processArticle(article);
        
        if (processed) {
          processedArticles.push(processed);
          console.log(`✅ Processed ${processedArticles.length}/10: ${processed.title}`);
        }
      }

      if (processedArticles.length === 0) {
        throw new Error('No articles were successfully processed');
      }

      // Replace articles in database
      await this.replaceArticles(processedArticles);
      
      console.log(`\n🎉 Pipeline completed successfully!`);
      console.log(`📊 Processed: ${processedArticles.length} articles`);
      console.log(`💾 Stored in MongoDB: articles collection`);
      
      return processedArticles;
      
    } catch (error) {
      console.error('❌ Pipeline failed:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

module.exports = NewsPipeline;
