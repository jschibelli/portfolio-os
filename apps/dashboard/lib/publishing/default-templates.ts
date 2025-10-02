/**
 * Default Publishing Templates
 * Pre-configured templates for common publishing scenarios
 */

import { PublishingOptions } from './types';

export const defaultTemplates = [
  {
    name: 'Dashboard Only',
    description: 'Publish to Dashboard only (quick local publishing)',
    isDefault: true,
    options: {
      platforms: [
        {
          id: 'dashboard',
          name: 'dashboard',
          enabled: true,
          status: 'pending',
          settings: {}
        }
      ],
      crossPost: false,
      tags: [],
      categories: [],
      seo: {
        title: '',
        description: '',
        keywords: []
      },
      social: {
        autoShare: false,
        platforms: []
      },
      analytics: {
        trackViews: true,
        trackEngagement: true
      }
    } as PublishingOptions
  },
  {
    name: 'Dashboard + Hashnode',
    description: 'Publish to Dashboard and sync with Hashnode',
    isDefault: false,
    options: {
      platforms: [
        {
          id: 'dashboard',
          name: 'dashboard',
          enabled: true,
          status: 'pending',
          settings: {}
        },
        {
          id: 'hashnode',
          name: 'hashnode',
          enabled: true,
          status: 'pending',
          settings: {
            publicationId: process.env.HASHNODE_PUBLICATION_ID || '',
            canonicalUrl: ''
          }
        }
      ],
      crossPost: true,
      tags: [],
      categories: [],
      seo: {
        title: '',
        description: '',
        keywords: []
      },
      social: {
        autoShare: true,
        platforms: ['twitter', 'linkedin']
      },
      analytics: {
        trackViews: true,
        trackEngagement: true
      }
    } as PublishingOptions
  },
  {
    name: 'All Platforms',
    description: 'Publish to all configured platforms (maximum reach)',
    isDefault: false,
    options: {
      platforms: [
        {
          id: 'dashboard',
          name: 'dashboard',
          enabled: true,
          status: 'pending',
          settings: {}
        },
        {
          id: 'hashnode',
          name: 'hashnode',
          enabled: true,
          status: 'pending',
          settings: {
            publicationId: process.env.HASHNODE_PUBLICATION_ID || '',
            canonicalUrl: ''
          }
        },
        {
          id: 'devto',
          name: 'devto',
          enabled: true,
          status: 'pending',
          settings: {
            canonicalUrl: ''
          }
        },
        {
          id: 'medium',
          name: 'medium',
          enabled: true,
          status: 'pending',
          settings: {
            publishStatus: 'public',
            license: 'all-rights-reserved',
            canonicalUrl: ''
          }
        }
      ],
      crossPost: true,
      tags: [],
      categories: [],
      seo: {
        title: '',
        description: '',
        keywords: []
      },
      social: {
        autoShare: true,
        platforms: ['twitter', 'linkedin', 'facebook']
      },
      analytics: {
        trackViews: true,
        trackEngagement: true
      }
    } as PublishingOptions
  },
  {
    name: 'Developer Focus',
    description: 'Publish to Dashboard, Hashnode, and Dev.to (developer-focused platforms)',
    isDefault: false,
    options: {
      platforms: [
        {
          id: 'dashboard',
          name: 'dashboard',
          enabled: true,
          status: 'pending',
          settings: {}
        },
        {
          id: 'hashnode',
          name: 'hashnode',
          enabled: true,
          status: 'pending',
          settings: {
            publicationId: process.env.HASHNODE_PUBLICATION_ID || '',
            canonicalUrl: ''
          }
        },
        {
          id: 'devto',
          name: 'devto',
          enabled: true,
          status: 'pending',
          settings: {
            canonicalUrl: ''
          }
        }
      ],
      crossPost: true,
      tags: [],
      categories: [],
      seo: {
        title: '',
        description: '',
        keywords: []
      },
      social: {
        autoShare: true,
        platforms: ['twitter', 'linkedin']
      },
      analytics: {
        trackViews: true,
        trackEngagement: true
      }
    } as PublishingOptions
  }
];

/**
 * Initialize default templates in the database
 */
export async function initializeDefaultTemplates(prisma: any) {
  console.log('Initializing default publishing templates...');
  
  for (const template of defaultTemplates) {
    try {
      // Check if template already exists
      const existing = await prisma.publishingTemplate.findFirst({
        where: { name: template.name }
      });

      if (!existing) {
        await prisma.publishingTemplate.create({
          data: template
        });
        console.log(`Created template: ${template.name}`);
      } else {
        console.log(`Template already exists: ${template.name}`);
      }
    } catch (error) {
      console.error(`Error creating template ${template.name}:`, error);
    }
  }
  
  console.log('Default templates initialization complete');
}
