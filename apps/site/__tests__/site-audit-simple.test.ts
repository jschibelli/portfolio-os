// import { describe, it, expect } from '@jest/globals';
import { getAllProjects, getProjectBySlug } from '../lib/project-utils';
import { allProjects } from '../data/projects';

describe('Site Audit - Data and Routing Tests', () => {
  describe('Project Data Integrity', () => {
    it('should have Tendril project in all projects', async () => {
      const projects = await getAllProjects();
      const tendrilProject = projects.find(p => p.id === 'tendrilo');
      
      expect(tendrilProject).toBeDefined();
      expect(tendrilProject?.title).toContain('Tendril');
      expect(tendrilProject?.caseStudyUrl).toBeDefined();
    });

    it('should have valid case study URLs for projects with case studies', async () => {
      const projects = await getAllProjects();
      
      for (const project of projects) {
        if (project.caseStudyUrl) {
          expect(project.caseStudyUrl).toMatch(/^\/case-studies\//);
          expect(project.caseStudyUrl).not.toBe('');
        }
      }
    });

    it('should have valid project slugs', async () => {
      const projects = await getAllProjects();
      
      for (const project of projects) {
        expect(project.slug).toBeDefined();
        expect(project.slug).not.toBe('');
        expect(project.slug).toMatch(/^[a-z0-9-]+$/);
      }
    });

    it('should have unique project slugs', async () => {
      const projects = await getAllProjects();
      const slugs = projects.map(p => p.slug);
      const uniqueSlugs = new Set(slugs);
      
      expect(slugs.length).toBe(uniqueSlugs.size);
    });

    it('should have valid project IDs', async () => {
      const projects = await getAllProjects();
      
      for (const project of projects) {
        expect(project.id).toBeDefined();
        expect(project.id).not.toBe('');
        expect(project.id).toMatch(/^[a-z0-9-]+$/);
      }
    });

    it('should have unique project IDs', async () => {
      const projects = await getAllProjects();
      const ids = projects.map(p => p.id);
      const uniqueIds = new Set(ids);
      
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('Project Utility Functions', () => {
    it('should get project by slug', async () => {
      const tendrilProject = await getProjectBySlug('tendrilo');
      
      expect(tendrilProject).toBeDefined();
      expect(tendrilProject?.title).toContain('Tendril');
    });

    it('should return null for non-existent slug', async () => {
      const nonExistentProject = await getProjectBySlug('non-existent-project');
      
      expect(nonExistentProject).toBeNull();
    });

    it('should have consistent data between getAllProjects and getProjectBySlug', async () => {
      const allProjects = await getAllProjects();
      
      for (const project of allProjects) {
        const projectBySlug = await getProjectBySlug(project.slug);
        expect(projectBySlug).toEqual(project);
      }
    });
  });

  describe('Case Study Data Structure', () => {
    it('should have Tendril case study data structure', async () => {
      const tendrilProject = await getProjectBySlug('tendrilo');
      
      expect(tendrilProject).toBeDefined();
      expect(tendrilProject?.caseStudyUrl).toBe('/case-studies/tendrilo-case-study');
      expect(tendrilProject?.tags).toContain('SaaS');
      expect(tendrilProject?.tags).toContain('AI');
      expect(tendrilProject?.featured).toBe(true);
    });

    it('should have valid external URLs', async () => {
      const projects = await getAllProjects();
      
      for (const project of projects) {
        if (project.liveUrl) {
          expect(project.liveUrl).toMatch(/^https?:\/\//);
        }
        if (project.githubUrl) {
          expect(project.githubUrl).toMatch(/^https?:\/\//);
        }
        if (project.documentationUrl) {
          expect(project.documentationUrl).toMatch(/^https?:\/\//);
        }
      }
    });
  });

  describe('Navigation Data', () => {
    it('should have all required navigation data', async () => {
      const projects = await getAllProjects();
      
      for (const project of projects) {
        expect(project.title).toBeDefined();
        expect(project.title).not.toBe('');
        expect(project.description).toBeDefined();
        expect(project.description).not.toBe('');
        expect(project.tags).toBeDefined();
        expect(Array.isArray(project.tags)).toBe(true);
      }
    });

    it('should have featured projects', async () => {
      const projects = await getAllProjects();
      const featuredProjects = projects.filter(p => p.featured);
      
      expect(featuredProjects.length).toBeGreaterThan(0);
    });

    it('should have projects with different statuses', async () => {
      const projects = await getAllProjects();
      const statuses = [...new Set(projects.map(p => p.status))];
      
      expect(statuses.length).toBeGreaterThan(0);
    });
  });

  describe('Data Consistency', () => {
    it('should have consistent project data structure', async () => {
      const projects = await getAllProjects();
      
      for (const project of projects) {
        // Required fields
        expect(project.id).toBeDefined();
        expect(project.title).toBeDefined();
        expect(project.slug).toBeDefined();
        expect(project.description).toBeDefined();
        expect(project.tags).toBeDefined();
        expect(project.technologies).toBeDefined();
        expect(project.category).toBeDefined();
        expect(project.status).toBeDefined();
        
        // Optional fields should be strings or undefined
        if (project.client) expect(typeof project.client).toBe('string');
        if (project.industry) expect(typeof project.industry).toBe('string');
        if (project.teamSize) expect(typeof project.teamSize).toBe('string');
        if (project.duration) expect(typeof project.duration).toBe('string');
        if (project.startDate) expect(typeof project.startDate).toBe('string');
        if (project.endDate) expect(typeof project.endDate).toBe('string');
      }
    });

    it('should have valid date formats for date fields', async () => {
      const projects = await getAllProjects();
      
      for (const project of projects) {
        if (project.startDate) {
          expect(() => new Date(project.startDate!)).not.toThrow();
        }
        if (project.endDate) {
          expect(() => new Date(project.endDate!)).not.toThrow();
        }
      }
    });
  });
});
