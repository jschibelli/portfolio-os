/**
 * Test script for Portfolio OS chatbot knowledge base
 */

import { searchKnowledgeBase, getKnowledgeItem } from './index';

// Test questions about Portfolio OS
const testQuestions = [
  "What is Portfolio OS?",
  "How does the multi-agent system work?",
  "What automation scripts are included?",
  "What are the key metrics and results?",
  "How is the architecture structured?",
  "What testing strategy is used?",
  "How is deployment handled?",
  "What lessons were learned?",
  "What is the tech stack?",
  "How does the 5-agent system work?"
];

/**
 * Test knowledge base search functionality
 */
export function testKnowledgeBase() {
  console.log('🧪 Testing Portfolio OS Knowledge Base\n');
  
  testQuestions.forEach((question, index) => {
    console.log(`\n${index + 1}. Question: "${question}"`);
    
    // Search for relevant knowledge
    const results = searchKnowledgeBase(question);
    
    if (results.length > 0) {
      console.log(`   ✅ Found ${results.length} relevant knowledge items:`);
      results.slice(0, 3).forEach((item, i) => {
        console.log(`      ${i + 1}. ${item.title} (Priority: ${item.priority})`);
        console.log(`         Category: ${item.category}`);
        console.log(`         Tags: ${item.tags.join(', ')}`);
      });
    } else {
      console.log(`   ❌ No relevant knowledge found`);
    }
  });
  
  console.log('\n🔍 Testing specific knowledge item retrieval:');
  
  // Test specific item retrieval
  const specificItems = [
    'portfolio-os-overview',
    'multi-agent-system',
    'automation-scripts',
    'case-study-results'
  ];
  
  specificItems.forEach(itemId => {
    const item = getKnowledgeItem(itemId);
    if (item) {
      console.log(`   ✅ Found item "${item.title}" (${item.category})`);
    } else {
      console.log(`   ❌ Item "${itemId}" not found`);
    }
  });
}

/**
 * Test category-specific searches
 */
export function testCategorySearches() {
  console.log('\n📂 Testing category-specific searches:\n');
  
  const categories = ['portfolio-os', 'architecture', 'automation', 'multi-agent', 'deployment', 'case-study', 'general'];
  
  categories.forEach(category => {
    const results = searchKnowledgeBase('', category as any);
    console.log(`${category}: ${results.length} items`);
    results.forEach(item => {
      console.log(`  - ${item.title} (Priority: ${item.priority})`);
    });
  });
}

/**
 * Test search queries
 */
export function testSearchQueries() {
  console.log('\n🔎 Testing specific search queries:\n');
  
  const searchQueries = [
    'monorepo',
    'turborepo',
    'git worktrees',
    'automation',
    'testing',
    'deployment',
    'performance',
    'ai integration',
    'powerShell scripts',
    'lighthouse score'
  ];
  
  searchQueries.forEach(query => {
    const results = searchKnowledgeBase(query);
    console.log(`"${query}": ${results.length} results`);
    if (results.length > 0) {
      console.log(`  Top result: ${results[0].title}`);
    }
  });
}

/**
 * Run all tests
 */
export function runAllTests() {
  testKnowledgeBase();
  testCategorySearches();
  testSearchQueries();
  
  console.log('\n✅ Knowledge base testing complete!');
  console.log('\nThe chatbot should now be able to answer comprehensive questions about:');
  console.log('- Portfolio OS overview and architecture');
  console.log('- Multi-agent development system');
  console.log('- 100+ automation scripts');
  console.log('- Testing strategy and metrics');
  console.log('- Deployment and infrastructure');
  console.log('- Case study results and lessons learned');
}

// Export for use in other files
export default {
  testKnowledgeBase,
  testCategorySearches,
  testSearchQueries,
  runAllTests
};
