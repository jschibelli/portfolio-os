import { expect, test } from '@playwright/test';
import { 
  validateCaseStudyStructure, 
  getMissingSections, 
  CASE_STUDY_SECTIONS,
  createNewCaseStudy 
} from '../lib/case-study-template';

test.describe('Case Study Content Validation', () => {
  test('should validate complete case study structure', () => {
    const validCaseStudy = `# Test Case Study

## Problem Statement
This is the problem we needed to solve.

## Research & Analysis
Here's our research and analysis.

## Solution Design
This is how we designed the solution.

## Implementation
Here's how we implemented it.

## Results & Metrics
These are our results and metrics.

## Lessons Learned
Here's what we learned.

## Next Steps
These are our next steps.`;

    const isValid = validateCaseStudyStructure(validCaseStudy);
    expect(isValid).toBe(true);
  });

  test('should detect missing sections', () => {
    const incompleteCaseStudy = `# Test Case Study

## Problem Statement
This is the problem we needed to solve.

## Research & Analysis
Here's our research and analysis.

## Solution Design
This is how we designed the solution.

## Implementation
Here's how we implemented it.

## Results & Metrics
These are our results and metrics.

## Lessons Learned
Here's what we learned.

## Missing Next Steps Section
This should be "Next Steps" but it's not.`;

    const isValid = validateCaseStudyStructure(incompleteCaseStudy);
    expect(isValid).toBe(false);

    const missingSections = getMissingSections(incompleteCaseStudy);
    expect(missingSections).toContain('Next Steps');
  });

  test('should validate case study with different heading formats', () => {
    const caseStudyWithVariations = `# Test Case Study

## Problem Statement
This is the problem we needed to solve.

## Research & Analysis
Here's our research and analysis.

## Solution Design
This is how we designed the solution.

## Implementation
Here's how we implemented it.

## Results & Metrics
These are our results and metrics.

## Lessons Learned
Here's what we learned.

## Next Steps
These are our next steps.`;

    const isValid = validateCaseStudyStructure(caseStudyWithVariations);
    expect(isValid).toBe(true);
  });

  test('should create new case study with standard structure', () => {
    const title = 'Test Case Study';
    const customContent = {
      'problem-statement': 'Custom problem statement content',
      'results-metrics': 'Custom results content'
    };

    const newCaseStudy = createNewCaseStudy(title, customContent);
    
    // Should contain the title
    expect(newCaseStudy).toContain(`# ${title}`);
    
    // Should contain all required sections
    CASE_STUDY_SECTIONS.forEach(section => {
      expect(newCaseStudy).toContain(`## ${section.title}`);
    });
    
    // Should contain custom content where provided
    expect(newCaseStudy).toContain('Custom problem statement content');
    expect(newCaseStudy).toContain('Custom results content');
    
    // Should contain default content where not provided
    expect(newCaseStudy).toContain('[Market research, competitive analysis, and data gathering]');
  });

  test('should validate case study sections are properly structured', () => {
    const validCaseStudy = `# Test Case Study

## Problem Statement
This is the problem we needed to solve.

## Research & Analysis
Here's our research and analysis.

## Solution Design
This is how we designed the solution.

## Implementation
Here's how we implemented it.

## Results & Metrics
These are our results and metrics.

## Lessons Learned
Here's what we learned.

## Next Steps
These are our next steps.`;

    const missingSections = getMissingSections(validCaseStudy);
    expect(missingSections).toHaveLength(0);
  });

  test('should handle case study with extra content between sections', () => {
    const caseStudyWithExtraContent = `# Test Case Study

Some introductory content here.

## Problem Statement
This is the problem we needed to solve.

Some additional context.

## Research & Analysis
Here's our research and analysis.

## Solution Design
This is how we designed the solution.

## Implementation
Here's how we implemented it.

## Results & Metrics
These are our results and metrics.

## Lessons Learned
Here's what we learned.

## Next Steps
These are our next steps.

Some concluding thoughts.`;

    const isValid = validateCaseStudyStructure(caseStudyWithExtraContent);
    expect(isValid).toBe(true);
  });

  test('should validate all required sections are present', () => {
    const requiredSections = [
      'Problem Statement',
      'Research & Analysis', 
      'Solution Design',
      'Implementation',
      'Results & Metrics',
      'Lessons Learned',
      'Next Steps'
    ];

    expect(CASE_STUDY_SECTIONS).toHaveLength(7);
    
    requiredSections.forEach(section => {
      const found = CASE_STUDY_SECTIONS.find(s => s.title === section);
      expect(found).toBeDefined();
    });
  });
});
