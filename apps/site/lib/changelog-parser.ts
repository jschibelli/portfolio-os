import fs from 'fs';
import path from 'path';

export interface ChangelogVersion {
  version: string;
  versionStatus: 'alpha' | 'beta' | 'rc' | 'stable';
  date: string;
  title?: string;
  features: string[];
  improvements: string[];
  fixes: string[];
  upcoming: string[];
}

/**
 * Parses the main CHANGELOG.md and extracts version information
 */
export function parseChangelog(): ChangelogVersion | null {
  try {
    // Try multiple potential changelog locations
    // Note: process.cwd() in Next.js dev mode points to the app directory
    const cwd = process.cwd();
    
    const possiblePaths = [
      path.join(cwd, '../docs/CHANGELOG.md'), // From apps/site to apps/docs
      path.join(cwd, '../../docs/CHANGELOG.md'), // From apps/site to root/docs
      path.join(cwd, 'docs/CHANGELOG.md'), // docs in same dir
    ];
    
    let content = '';
    
    for (const changelogPath of possiblePaths) {
      try {
        if (fs.existsSync(changelogPath)) {
          content = fs.readFileSync(changelogPath, 'utf-8');
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!content) {
      return null;
    }
    
    // Extract current version from header
    const versionMatch = content.match(/\*\*Current Version:\*\*\s*([\d.]+)/);
    const currentVersion = versionMatch ? versionMatch[1] : '1.0.0';
    
    // Find the first version section (latest release)
    const versionSectionMatch = content.match(/##\s+\[([\d.]+)\]\s+-\s+([^-]+)-\s+(.+)/);
    
    if (!versionSectionMatch) {
      return null;
    }
    
    const version = versionSectionMatch[1];
    const date = versionSectionMatch[2].trim();
    const title = versionSectionMatch[3].trim();
    
    // Determine version status
    let versionStatus: 'alpha' | 'beta' | 'rc' | 'stable' = 'stable';
    if (version.includes('alpha')) versionStatus = 'alpha';
    else if (version.includes('beta')) versionStatus = 'beta';
    else if (version.includes('rc')) versionStatus = 'rc';
    else if (parseFloat(version) >= 1.0) versionStatus = 'stable';
    else versionStatus = 'beta';
    
    // Extract the content for the first version section
    const sections = content.split(/##\s+\[/);
    const latestSection = sections[1] || '';
    
    // Extract features
    const featuresMatch = latestSection.match(/###\s+Features\s+([\s\S]*?)(?=###|$)/);
    const features = featuresMatch 
      ? featuresMatch[1]
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^-\s*/, '').trim())
          .slice(0, 4)
      : [];
    
    // Extract improvements
    const improvementsMatch = latestSection.match(/###\s+Improvements\s+([\s\S]*?)(?=###|$)/);
    const improvements = improvementsMatch
      ? improvementsMatch[1]
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^-\s*/, '').trim())
          .slice(0, 3)
      : [];
    
    // Extract fixes
    const fixesMatch = latestSection.match(/###\s+Fixes\s+([\s\S]*?)(?=###|$)/);
    const fixes = fixesMatch
      ? fixesMatch[1]
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^-\s*/, '').trim())
          .slice(0, 2)
      : [];
    
    // Look for "Unreleased" or "Coming Soon" sections
    const upcomingMatch = content.match(/##\s+\[?Unreleased\]?.*?\n([\s\S]*?)(?=##|$)/);
    const upcoming = upcomingMatch
      ? upcomingMatch[1]
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^-\s*/, '').trim())
          .slice(0, 3)
      : [];
    
    return {
      version,
      versionStatus,
      date,
      title,
      features,
      improvements,
      fixes,
      upcoming,
    };
  } catch (error) {
    console.error('Failed to parse changelog:', error);
    return null;
  }
}

/**
 * Gets recent updates by combining features and improvements from latest version
 */
export function getRecentUpdates(): string[] {
  const changelog = parseChangelog();
  if (!changelog) return [];
  
  return [
    ...changelog.features.slice(0, 3),
    ...changelog.improvements.slice(0, 1),
  ].slice(0, 4);
}

/**
 * Gets upcoming features from changelog
 */
export function getUpcomingFeatures(): string[] {
  const changelog = parseChangelog();
  if (!changelog) return [];
  
  return changelog.upcoming.slice(0, 3);
}

/**
 * Gets current version info
 */
export function getCurrentVersion(): { version: string; status: string; date: string } {
  const changelog = parseChangelog();
  if (!changelog) {
    return { version: '1.0.0', status: 'stable', date: 'October 2025' };
  }
  
  return {
    version: changelog.version,
    status: changelog.versionStatus,
    date: changelog.date,
  };
}

