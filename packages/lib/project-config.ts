/**
 * Project Configuration Utility
 * 
 * This utility handles GitHub Project configuration with support for
 * environment variables and fallback to cached values.
 */

interface ProjectConfig {
  number: number;
  url: string;
  description: string;
  lastUpdated: string;
  purpose: string;
  configurable: {
    note: string;
    environmentVariable: string;
  };
}

/**
 * Gets the GitHub Project configuration
 * @returns ProjectConfig object with current project settings
 */
export function getProjectConfig(): ProjectConfig {
  // Try to get project number from environment variable first
  const envProjectNumber = process.env.GITHUB_PROJECT_NUMBER;
  const projectNumber = envProjectNumber ? parseInt(envProjectNumber, 10) : 19;
  
  // Validate project number
  if (isNaN(projectNumber) || projectNumber <= 0) {
    console.warn('Invalid GITHUB_PROJECT_NUMBER, falling back to default: 19');
  }
  
  const finalProjectNumber = isNaN(projectNumber) || projectNumber <= 0 ? 19 : projectNumber;
  
  return {
    number: finalProjectNumber,
    url: `https://github.com/users/jschibelli/projects/${finalProjectNumber}`,
    description: "GitHub Project cache for Portfolio Site - schibelli.dev project management",
    lastUpdated: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    purpose: "Stores GitHub Project metadata for automation scripts and project tracking",
    configurable: {
      note: "Project number can be updated via environment variable GITHUB_PROJECT_NUMBER if needed",
      environmentVariable: "GITHUB_PROJECT_NUMBER"
    }
  };
}

/**
 * Updates the project cache file with current configuration
 * @param config - Project configuration to write
 */
export function updateProjectCache(config: ProjectConfig): void {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const cachePath = path.join(process.cwd(), '.project_cache.json');
    const cacheContent = JSON.stringify(config, null, 2);
    
    fs.writeFileSync(cachePath, cacheContent, 'utf8');
    console.log(`Project cache updated: ${config.url}`);
  } catch (error) {
    console.error('Failed to update project cache:', error);
  }
}

/**
 * Validates project URL format
 * @param url - URL to validate
 * @returns boolean indicating if URL is valid
 */
export function validateProjectUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'github.com' && 
           urlObj.pathname.includes('/users/') && 
           urlObj.pathname.includes('/projects/');
  } catch {
    return false;
  }
}
