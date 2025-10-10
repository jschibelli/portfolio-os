/**
 * Docs Application Integration
 * Dynamically loads content from the docs application for chatbot knowledge base
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface DocContent {
  title: string;
  content: string;
  category: string;
  tags: string[];
  filePath: string;
}

/**
 * Load MDX content from docs application
 */
export function loadDocsContent(docsPath: string = '../../../apps/docs/contents/docs'): DocContent[] {
  const content: DocContent[] = [];
  
  try {
    const fullPath = path.resolve(process.cwd(), docsPath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`Docs path not found: ${fullPath}`);
      return content;
    }
    
    // Recursively scan docs directory
    scanDirectory(fullPath, content, docsPath);
    
  } catch (error) {
    console.error('Error loading docs content:', error);
  }
  
  return content;
}

/**
 * Recursively scan directory for MDX files
 */
function scanDirectory(dirPath: string, content: DocContent[], basePath: string, category: string = 'docs') {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Use directory name as category
      const newCategory = item;
      scanDirectory(itemPath, content, basePath, newCategory);
    } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
      try {
        const fileContent = fs.readFileSync(itemPath, 'utf-8');
        const { data: frontmatter, content: markdownContent } = matter(fileContent);
        
        // Generate relative path from base
        const relativePath = path.relative(basePath, itemPath);
        
        content.push({
          title: frontmatter.title || path.basename(item, path.extname(item)),
          content: markdownContent,
          category: category,
          tags: frontmatter.tags || [],
          filePath: relativePath
        });
        
      } catch (error) {
        console.error(`Error processing file ${itemPath}:`, error);
      }
    }
  }
}

/**
 * Convert docs content to knowledge base format
 */
export function convertDocsToKnowledge(docsContent: DocContent[]) {
  return docsContent.map(doc => ({
    id: `docs-${doc.filePath.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
    title: doc.title,
    category: 'docs' as const,
    content: `# ${doc.title}\n\n${doc.content}`,
    tags: [...doc.tags, 'documentation', doc.category],
    priority: getPriorityForDoc(doc),
    lastUpdated: new Date().toISOString()
  }));
}

/**
 * Assign priority based on doc category and title
 */
function getPriorityForDoc(doc: DocContent): number {
  // Higher priority for core architecture and setup docs
  if (doc.category === 'architecture' || doc.category === 'setup') {
    return 8;
  }
  
  if (doc.category === 'multi-agent' || doc.category === 'developer-guide') {
    return 7;
  }
  
  if (doc.category === 'scripts-reference' || doc.category === 'troubleshooting') {
    return 6;
  }
  
  // Default priority for other docs
  return 5;
}

/**
 * Load and process all docs content
 */
export function loadAllDocsKnowledge() {
  const docsContent = loadDocsContent();
  return convertDocsToKnowledge(docsContent);
}

/**
 * Get specific docs categories for chatbot
 */
export function getDocsCategories() {
  return [
    'architecture',
    'setup', 
    'multi-agent',
    'developer-guide',
    'scripts-reference',
    'troubleshooting',
    'getting-started',
    'api-reference',
    'apps-packages',
    'markdown'
  ];
}
