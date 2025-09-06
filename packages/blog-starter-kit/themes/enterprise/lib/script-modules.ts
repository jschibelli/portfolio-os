/**
 * Script Modularization System
 * 
 * This module provides a system for modularizing test scripts and other utilities
 * to improve maintainability and reusability.
 * 
 * Addresses code review feedback from PR #37 about modularizing test scripts
 * for better maintainability when they become extensive.
 */

import { ErrorHandler, ErrorType, ErrorSeverity } from './error-handler';

// Module interface
export interface ScriptModule {
  name: string;
  version: string;
  description: string;
  dependencies: string[];
  execute: (config: ModuleConfig) => Promise<ModuleResult>;
  validate?: (config: ModuleConfig) => Promise<boolean>;
  cleanup?: () => Promise<void>;
}

// Module configuration
export interface ModuleConfig {
  [key: string]: any;
  timeout?: number;
  retries?: number;
  verbose?: boolean;
  output?: string;
}

// Module result
export interface ModuleResult {
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
  metadata?: Record<string, any>;
}

// Module registry
export class ModuleRegistry {
  private modules: Map<string, ScriptModule> = new Map();
  private errorHandler: ErrorHandler;

  constructor() {
    this.errorHandler = new ErrorHandler();
  }

  /**
   * Registers a module
   */
  register(module: ScriptModule): void {
    this.modules.set(module.name, module);
  }

  /**
   * Gets a module by name
   */
  get(name: string): ScriptModule | undefined {
    return this.modules.get(name);
  }

  /**
   * Lists all registered modules
   */
  list(): ScriptModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Executes a module with error handling
   */
  async execute(
    name: string, 
    config: ModuleConfig = {}
  ): Promise<ModuleResult> {
    const module = this.get(name);
    if (!module) {
      throw new Error(`Module '${name}' not found`);
    }

    const startTime = Date.now();
    
    try {
      // Validate module if validator exists
      if (module.validate) {
        const isValid = await module.validate(config);
        if (!isValid) {
          throw new Error(`Module '${name}' validation failed`);
        }
      }

      // Execute module
      const result = await module.execute(config);
      result.duration = Date.now() - startTime;
      
      return result;
    } catch (error) {
      const appError = await this.errorHandler.handleError(error as Error, {
        module: name,
        config
      });

      return {
        success: false,
        error: appError.message,
        duration: Date.now() - startTime,
        metadata: {
          errorType: appError.type,
          errorSeverity: appError.severity,
          suggestions: appError.suggestions
        }
      };
    }
  }

  /**
   * Executes multiple modules in sequence
   */
  async executeSequence(
    moduleNames: string[],
    config: ModuleConfig = {}
  ): Promise<ModuleResult[]> {
    const results: ModuleResult[] = [];

    for (const name of moduleNames) {
      const result = await this.execute(name, config);
      results.push(result);

      // Stop on critical failure
      if (!result.success && result.metadata?.errorSeverity === ErrorSeverity.CRITICAL) {
        break;
      }
    }

    return results;
  }

  /**
   * Executes multiple modules in parallel
   */
  async executeParallel(
    moduleNames: string[],
    config: ModuleConfig = {}
  ): Promise<ModuleResult[]> {
    const promises = moduleNames.map(name => this.execute(name, config));
    return Promise.all(promises);
  }

  /**
   * Cleans up all modules
   */
  async cleanup(): Promise<void> {
    const cleanupPromises = this.list()
      .filter(module => module.cleanup)
      .map(module => module.cleanup!());

    await Promise.all(cleanupPromises);
  }
}

// Base module class
export abstract class BaseModule implements ScriptModule {
  abstract name: string;
  abstract version: string;
  abstract description: string;
  abstract dependencies: string[];
  
  protected errorHandler: ErrorHandler;

  constructor() {
    this.errorHandler = new ErrorHandler();
  }

  abstract execute(config: ModuleConfig): Promise<ModuleResult>;

  async validate(config: ModuleConfig): Promise<boolean> {
    // Default validation - check required dependencies
    try {
      for (const dep of this.dependencies) {
        require(dep);
      }
      return true;
    } catch (error) {
      console.error(`Dependency '${error}' not found for module '${this.name}'`);
      return false;
    }
  }

  async cleanup(): Promise<void> {
    // Default cleanup - nothing to do
  }
}

// Performance testing module
export class PerformanceTestModule extends BaseModule {
  name = 'performance-test';
  version = '1.0.0';
  description = 'Performance testing module with Core Web Vitals monitoring';
  dependencies = ['child_process', 'fs', 'path'];

  async execute(config: ModuleConfig): Promise<ModuleResult> {
    const { execSync } = require('child_process');
    const fs = require('fs');
    const path = require('path');

    try {
      // Run performance tests
      const output = execSync('npm run test:performance', {
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: config.timeout || 300000
      });

      // Parse results
      const results = this.parsePerformanceResults(output);

      return {
        success: true,
        data: results,
        metadata: {
          testType: 'performance',
          outputLength: output.length
        }
      };
    } catch (error) {
      throw new Error(`Performance test failed: ${error.message}`);
    }
  }

  private parsePerformanceResults(output: string): any {
    // Simple parsing - can be enhanced
    const lines = output.split('\n');
    const results: any = {};

    lines.forEach(line => {
      if (line.includes('LCP:')) {
        results.lcp = this.extractMetric(line);
      } else if (line.includes('FID:')) {
        results.fid = this.extractMetric(line);
      } else if (line.includes('CLS:')) {
        results.cls = this.extractMetric(line);
      }
    });

    return results;
  }

  private extractMetric(line: string): number | null {
    const match = line.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : null;
  }
}

// Security testing module
export class SecurityTestModule extends BaseModule {
  name = 'security-test';
  version = '1.0.0';
  description = 'Security testing module with vulnerability scanning';
  dependencies = ['child_process', 'fs', 'path'];

  async execute(config: ModuleConfig): Promise<ModuleResult> {
    const { execSync } = require('child_process');

    try {
      // Run security audit
      const output = execSync('npm audit --json', {
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: config.timeout || 180000
      });

      const auditResults = JSON.parse(output);
      const vulnerabilities = auditResults.metadata?.vulnerabilities || {};

      return {
        success: true,
        data: {
          vulnerabilities,
          summary: auditResults.metadata?.vulnerabilities
        },
        metadata: {
          testType: 'security',
          totalVulnerabilities: vulnerabilities.total || 0
        }
      };
    } catch (error) {
      throw new Error(`Security test failed: ${error.message}`);
    }
  }
}

// Accessibility testing module
export class AccessibilityTestModule extends BaseModule {
  name = 'accessibility-test';
  version = '1.0.0';
  description = 'Accessibility testing module with WCAG compliance checking';
  dependencies = ['child_process'];

  async execute(config: ModuleConfig): Promise<ModuleResult> {
    const { execSync } = require('child_process');

    try {
      // Run accessibility tests
      const output = execSync('npm run test:accessibility', {
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: config.timeout || 120000
      });

      return {
        success: true,
        data: { output },
        metadata: {
          testType: 'accessibility',
          outputLength: output.length
        }
      };
    } catch (error) {
      throw new Error(`Accessibility test failed: ${error.message}`);
    }
  }
}

// Visual regression testing module
export class VisualTestModule extends BaseModule {
  name = 'visual-test';
  version = '1.0.0';
  description = 'Visual regression testing module with screenshot comparison';
  dependencies = ['child_process'];

  async execute(config: ModuleConfig): Promise<ModuleResult> {
    const { execSync } = require('child_process');

    try {
      // Run visual tests
      const output = execSync('npm run test:visual', {
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: config.timeout || 180000
      });

      return {
        success: true,
        data: { output },
        metadata: {
          testType: 'visual',
          outputLength: output.length
        }
      };
    } catch (error) {
      throw new Error(`Visual test failed: ${error.message}`);
    }
  }
}

// SEO testing module
export class SEOTestModule extends BaseModule {
  name = 'seo-test';
  version = '1.0.0';
  description = 'SEO testing module with meta tag and structured data validation';
  dependencies = ['child_process'];

  async execute(config: ModuleConfig): Promise<ModuleResult> {
    const { execSync } = require('child_process');

    try {
      // Run SEO tests
      const output = execSync('npm run test:seo', {
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: config.timeout || 120000
      });

      return {
        success: true,
        data: { output },
        metadata: {
          testType: 'seo',
          outputLength: output.length
        }
      };
    } catch (error) {
      throw new Error(`SEO test failed: ${error.message}`);
    }
  }
}

// Module factory
export class ModuleFactory {
  private registry: ModuleRegistry;

  constructor() {
    this.registry = new ModuleRegistry();
    this.registerDefaultModules();
  }

  /**
   * Registers default modules
   */
  private registerDefaultModules(): void {
    this.registry.register(new PerformanceTestModule());
    this.registry.register(new SecurityTestModule());
    this.registry.register(new AccessibilityTestModule());
    this.registry.register(new VisualTestModule());
    this.registry.register(new SEOTestModule());
  }

  /**
   * Gets the module registry
   */
  getRegistry(): ModuleRegistry {
    return this.registry;
  }

  /**
   * Creates a custom module
   */
  createModule(
    name: string,
    version: string,
    description: string,
    dependencies: string[],
    execute: (config: ModuleConfig) => Promise<ModuleResult>
  ): ScriptModule {
    return {
      name,
      version,
      description,
      dependencies,
      execute
    };
  }
}

// Export singleton factory
export const moduleFactory = new ModuleFactory();

// Export default
export default ModuleRegistry;
