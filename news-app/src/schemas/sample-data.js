// Sample data schemas for MongoDB collections

// Articles Collection Sample Schema
const sampleArticleSchema = {
  title: "OpenAI Unveils GPT-5: Revolutionary AI Model with Enhanced Reasoning Capabilities",
  coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
  publisherName: "TechCrunch",
  publisherLogo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop",
  authorName: "Sarah Chen",
  datePosted: new Date("2024-01-15T10:30:00Z"),
  quickSummary: "OpenAI announces GPT-5 with breakthrough reasoning abilities, promising to revolutionize AI applications across industries.",
  detailedSummary: "OpenAI has officially unveiled GPT-5, their most advanced language model to date, featuring unprecedented reasoning capabilities that allow it to solve complex problems with human-like intuition. The new model demonstrates significant improvements in mathematical reasoning, scientific analysis, and creative problem-solving, marking a major milestone in artificial intelligence development.\n\nThe model's enhanced architecture includes novel attention mechanisms and training techniques that enable it to maintain context across longer conversations while providing more accurate and nuanced responses. Early testing shows GPT-5 outperforming previous models by 40% in standardized reasoning tests, with particular strengths in logical deduction and multi-step problem solving.",
  whyItMatters: "This breakthrough represents a quantum leap in AI capabilities that will fundamentally change how we interact with technology. For AI enthusiasts and learners, GPT-5's enhanced reasoning abilities open up new possibilities for educational tools, research assistance, and creative applications. The model's improved understanding of complex concepts makes it an invaluable resource for anyone looking to deepen their knowledge in AI, machine learning, and related fields.",
  sourceUrl: "https://techcrunch.com/2024/01/15/openai-gpt-5-announcement",
  category: "AI",
  createdAt: new Date(),
  updatedAt: new Date()
};

// Chats Collection Sample Schema
const sampleChatSchema = {
  sessionId: "chat-session-abc123def456",
  articleId: "article-gpt5-announcement-001",
  messages: [
    {
      text: "Can you explain what makes GPT-5 different from previous models?",
      isUser: true,
      timestamp: new Date("2024-01-15T11:00:00Z")
    },
    {
      text: "GPT-5 introduces several key improvements over previous models. The most significant is its enhanced reasoning capabilities, which allow it to solve complex problems with human-like intuition. It also features novel attention mechanisms and training techniques that enable better context understanding and more accurate responses.",
      isUser: false,
      timestamp: new Date("2024-01-15T11:00:15Z")
    },
    {
      text: "What kind of performance improvements does it show?",
      isUser: true,
      timestamp: new Date("2024-01-15T11:01:00Z")
    },
    {
      text: "According to the article, GPT-5 outperforms previous models by 40% in standardized reasoning tests. It shows particular strengths in mathematical reasoning, logical deduction, and multi-step problem solving. The model also maintains better context across longer conversations.",
      isUser: false,
      timestamp: new Date("2024-01-15T11:01:20Z")
    }
  ],
  articleTitle: "OpenAI Unveils GPT-5: Revolutionary AI Model with Enhanced Reasoning Capabilities",
  createdAt: new Date("2024-01-15T11:00:00Z"),
  updatedAt: new Date("2024-01-15T11:01:20Z")
};

// Validation Rules Summary
const validationRules = {
  articles: {
    requiredFields: [
      'title', 'coverImage', 'publisherName', 'publisherLogo', 'authorName',
      'datePosted', 'quickSummary', 'detailedSummary', 'whyItMatters',
      'sourceUrl', 'category', 'createdAt', 'updatedAt'
    ],
    fieldConstraints: {
      title: { type: 'string', minLength: 1, maxLength: 500 },
      coverImage: { type: 'string', pattern: '^https?://' },
      publisherName: { type: 'string', minLength: 1, maxLength: 100 },
      publisherLogo: { type: 'string', pattern: '^https?://' },
      authorName: { type: 'string', minLength: 1, maxLength: 100 },
      datePosted: { type: 'date' },
      quickSummary: { type: 'string', minLength: 10, maxLength: 500 },
      detailedSummary: { type: 'string', minLength: 50, maxLength: 5000 },
      whyItMatters: { type: 'string', minLength: 20, maxLength: 2000 },
      sourceUrl: { type: 'string', pattern: '^https?://' },
      category: { type: 'string', enum: ['AI', 'Technology', 'Startups', 'Funding', 'Machine Learning'] },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' }
    }
  },
  chats: {
    requiredFields: [
      'sessionId', 'articleId', 'messages', 'articleTitle', 'createdAt', 'updatedAt'
    ],
    fieldConstraints: {
      sessionId: { type: 'string', minLength: 10, maxLength: 100 },
      articleId: { type: 'string', minLength: 1, maxLength: 100 },
      messages: {
        type: 'array',
        items: {
          text: { type: 'string', minLength: 1, maxLength: 2000 },
          isUser: { type: 'boolean' },
          timestamp: { type: 'date' }
        }
      },
      articleTitle: { type: 'string', minLength: 1, maxLength: 500 },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' }
    }
  }
};

module.exports = {
  sampleArticleSchema,
  sampleChatSchema,
  validationRules
};
