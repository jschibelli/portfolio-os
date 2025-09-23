#!/usr/bin/env node

/**
 * Code Quality Checker
 * 
 * This script verifies that actual code implementation aligns with
 * the comprehensive guidelines outlined in the .gitkeep file.
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Configuration
const CONFIG = {
  // File patterns to check
  patterns: {
    source: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    test: ['**/*.test.*', '**/*.spec.*', '**/__tests__/**'],
    config: ['**/*.json', '**/*.js', '**/*.ts']
  },
  
  // Quality thresholds
  thresholds: {
    testCoverage: 80,
    documentation: 70,
    errorHandling: 90,
    security: 95
  },
  
  // Required patterns
  required: {
    errorHandling: ['try', 'catch', 'ErrorBoundary', 'error'],
    testing: ['describe', 'it', 'test', 'expect'],
    documentation: ['/**', '//', 'README'],
    security: ['validate', 'sanitize', 'escape', 'csrf']
  }
}

class CodeQualityChecker {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: []
    }
  }

  /**
   * Main execution function
   */
  async run() {
    console.log('🔍 Running comprehensive code quality check...\n')
    
    try {
      await this.checkTechnicalChoices()
      await this.checkDependencyMaintenance()
      await this.checkErrorHandling()
      await this.checkTestingStrategy()
      await this.checkDocumentation()
      await this.checkCodeQuality()
      await this.checkDevelopmentWorkflow()
      await this.checkScalabilityAndPerformance()
      
      this.generateReport()
    } catch (error) {
      console.error('❌ Quality check failed:', error.message)
      process.exit(1)
    }
  }

  /**
   * Check technical choices alignment
   */
  async checkTechnicalChoices() {
    console.log('📋 Checking technical choices...')
    
    const packageJson = this.readFile('package.json')
    if (!packageJson) {
      this.addIssue('error', 'Missing package.json file')
      return
    }

    const pkg = JSON.parse(packageJson)
    
    // Check for required technologies
    const requiredTech = {
      'next': 'Next.js framework',
      'react': 'React library',
      'typescript': 'TypeScript for type safety',
      'tailwindcss': 'Tailwind CSS for styling',
      'prisma': 'Prisma for database operations'
    }

    for (const [tech, description] of Object.entries(requiredTech)) {
      if (!pkg.dependencies?.[tech] && !pkg.devDependencies?.[tech]) {
        this.addIssue('warning', `Missing ${description}: ${tech}`)
      } else {
        this.addSuccess(`✅ ${description} found: ${tech}`)
      }
    }
  }

  /**
   * Check dependency maintenance
   */
  async checkDependencyMaintenance() {
    console.log('📦 Checking dependency maintenance...')
    
    try {
      // Check for outdated dependencies
      const outdated = execSync('npm outdated --json', { encoding: 'utf8' })
      const outdatedDeps = JSON.parse(outdated)
      
      if (Object.keys(outdatedDeps).length > 0) {
        this.addIssue('warning', `${Object.keys(outdatedDeps).length} outdated dependencies found`)
        console.log('   Consider updating:', Object.keys(outdatedDeps).join(', '))
      } else {
        this.addSuccess('✅ All dependencies are up to date')
      }
    } catch (error) {
      this.addIssue('info', 'Could not check dependency status')
    }
  }

  /**
   * Check error handling implementation
   */
  async checkErrorHandling() {
    console.log('🛡️ Checking error handling...')
    
    const sourceFiles = this.findFiles(CONFIG.patterns.source)
    let errorHandlingScore = 0
    let totalFiles = 0

    for (const file of sourceFiles) {
      const content = this.readFile(file)
      if (!content) continue

      totalFiles++
      const hasErrorHandling = CONFIG.required.errorHandling.some(pattern => 
        content.includes(pattern)
      )
      
      if (hasErrorHandling) {
        errorHandlingScore++
      } else {
        this.addIssue('warning', `Missing error handling in ${file}`)
      }
    }

    const score = totalFiles > 0 ? (errorHandlingScore / totalFiles) * 100 : 0
    if (score >= CONFIG.thresholds.errorHandling) {
      this.addSuccess(`✅ Error handling score: ${score.toFixed(1)}%`)
    } else {
      this.addIssue('error', `Error handling score too low: ${score.toFixed(1)}%`)
    }
  }

  /**
   * Check testing strategy implementation
   */
  async checkTestingStrategy() {
    console.log('🧪 Checking testing strategy...')
    
    const testFiles = this.findFiles(CONFIG.patterns.test)
    const sourceFiles = this.findFiles(CONFIG.patterns.source)
    
    if (testFiles.length === 0) {
      this.addIssue('error', 'No test files found')
      return
    }

    // Check test coverage
    try {
      const coverage = execSync('npm run test:coverage -- --coverage --silent', { encoding: 'utf8' })
      const coverageMatch = coverage.match(/All files\s+\|\s+(\d+\.\d+)%/)
      if (coverageMatch) {
        const coveragePercent = parseFloat(coverageMatch[1])
        if (coveragePercent >= CONFIG.thresholds.testCoverage) {
          this.addSuccess(`✅ Test coverage: ${coveragePercent}%`)
        } else {
          this.addIssue('warning', `Test coverage too low: ${coveragePercent}%`)
        }
      }
    } catch (error) {
      this.addIssue('info', 'Could not determine test coverage')
    }

    // Check for different test types
    const testTypes = {
      unit: testFiles.filter(f => f.includes('.test.') || f.includes('.spec.')),
      integration: testFiles.filter(f => f.includes('integration')),
      e2e: testFiles.filter(f => f.includes('e2e') || f.includes('playwright'))
    }

    for (const [type, files] of Object.entries(testTypes)) {
      if (files.length > 0) {
        this.addSuccess(`✅ ${type} tests found: ${files.length} files`)
      } else {
        this.addIssue('warning', `No ${type} tests found`)
      }
    }
  }

  /**
   * Check documentation quality
   */
  async checkDocumentation() {
    console.log('📚 Checking documentation...')
    
    const sourceFiles = this.findFiles(CONFIG.patterns.source)
    let documentedFiles = 0
    let totalFiles = 0

    for (const file of sourceFiles) {
      const content = this.readFile(file)
      if (!content) continue

      totalFiles++
      const hasDocumentation = CONFIG.required.documentation.some(pattern => 
        content.includes(pattern)
      )
      
      if (hasDocumentation) {
        documentedFiles++
      }
    }

    const score = totalFiles > 0 ? (documentedFiles / totalFiles) * 100 : 0
    if (score >= CONFIG.thresholds.documentation) {
      this.addSuccess(`✅ Documentation score: ${score.toFixed(1)}%`)
    } else {
      this.addIssue('warning', `Documentation score too low: ${score.toFixed(1)}%`)
    }

    // Check for README files
    const readmeFiles = ['README.md', 'apps/dashboard/README.md']
    for (const readme of readmeFiles) {
      if (this.fileExists(readme)) {
        this.addSuccess(`✅ Documentation found: ${readme}`)
      } else {
        this.addIssue('warning', `Missing documentation: ${readme}`)
      }
    }
  }

  /**
   * Check code quality standards
   */
  async checkCodeQuality() {
    console.log('🎯 Checking code quality...')
    
    // Check TypeScript configuration
    if (this.fileExists('tsconfig.json')) {
      this.addSuccess('✅ TypeScript configuration found')
    } else {
      this.addIssue('error', 'Missing TypeScript configuration')
    }

    // Check ESLint configuration
    if (this.fileExists('.eslintrc.json') || this.fileExists('eslint.config.js')) {
      this.addSuccess('✅ ESLint configuration found')
    } else {
      this.addIssue('warning', 'Missing ESLint configuration')
    }

    // Check Prettier configuration
    if (this.fileExists('.prettierrc') || this.fileExists('prettier.config.js')) {
      this.addSuccess('✅ Prettier configuration found')
    } else {
      this.addIssue('info', 'Consider adding Prettier configuration')
    }

    // Run linting check
    try {
      execSync('npm run lint', { stdio: 'pipe' })
      this.addSuccess('✅ Linting passed')
    } catch (error) {
      this.addIssue('error', 'Linting failed - fix issues before proceeding')
    }
  }

  /**
   * Check development workflow
   */
  async checkDevelopmentWorkflow() {
    console.log('🔄 Checking development workflow...')
    
    // Check for CI/CD configuration
    const ciFiles = ['.github/workflows/ci.yml', '.github/workflows/ci.yaml']
    let ciFound = false
    
    for (const ciFile of ciFiles) {
      if (this.fileExists(ciFile)) {
        this.addSuccess(`✅ CI/CD configuration found: ${ciFile}`)
        ciFound = true
        break
      }
    }
    
    if (!ciFound) {
      this.addIssue('warning', 'No CI/CD configuration found')
    }

    // Check for pre-commit hooks
    if (this.fileExists('.husky/pre-commit')) {
      this.addSuccess('✅ Pre-commit hooks configured')
    } else {
      this.addIssue('info', 'Consider adding pre-commit hooks')
    }

    // Check for PR templates
    const prTemplates = ['.github/pull_request_template.md', '.github/PULL_REQUEST_TEMPLATE.md']
    let prTemplateFound = false
    
    for (const template of prTemplates) {
      if (this.fileExists(template)) {
        this.addSuccess(`✅ PR template found: ${template}`)
        prTemplateFound = true
        break
      }
    }
    
    if (!prTemplateFound) {
      this.addIssue('info', 'Consider adding PR templates')
    }
  }

  /**
   * Check scalability and performance
   */
  async checkScalabilityAndPerformance() {
    console.log('⚡ Checking scalability and performance...')
    
    // Check for performance monitoring
    const perfFiles = this.findFiles(['**/performance*', '**/monitoring*'])
    if (perfFiles.length > 0) {
      this.addSuccess(`✅ Performance monitoring found: ${perfFiles.length} files`)
    } else {
      this.addIssue('info', 'Consider adding performance monitoring')
    }

    // Check for caching configuration
    const cacheFiles = this.findFiles(['**/cache*', '**/redis*'])
    if (cacheFiles.length > 0) {
      this.addSuccess(`✅ Caching configuration found: ${cacheFiles.length} files`)
    } else {
      this.addIssue('info', 'Consider adding caching for better performance')
    }

    // Check for database optimization
    const dbFiles = this.findFiles(['**/prisma*', '**/database*'])
    if (dbFiles.length > 0) {
      this.addSuccess(`✅ Database configuration found: ${dbFiles.length} files`)
    } else {
      this.addIssue('warning', 'Database configuration not found')
    }
  }

  /**
   * Generate final report
   */
  generateReport() {
    console.log('\n📊 Code Quality Report')
    console.log('='.repeat(50))
    
    const total = this.results.passed + this.results.failed + this.results.warnings
    const successRate = total > 0 ? (this.results.passed / total) * 100 : 0
    
    console.log(`✅ Passed: ${this.results.passed}`)
    console.log(`❌ Failed: ${this.results.failed}`)
    console.log(`⚠️  Warnings: ${this.results.warnings}`)
    console.log(`📈 Success Rate: ${successRate.toFixed(1)}%`)
    
    if (this.results.issues.length > 0) {
      console.log('\n🔍 Issues Found:')
      this.results.issues.forEach((issue, index) => {
        const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️'
        console.log(`${index + 1}. ${icon} ${issue.message}`)
      })
    }
    
    if (this.results.failed > 0) {
      console.log('\n❌ Quality check failed - please address the issues above')
      process.exit(1)
    } else {
      console.log('\n✅ Quality check passed!')
    }
  }

  // Helper methods
  findFiles(patterns) {
    const files = []
    const fs = require('fs')
    const path = require('path')
    
    function findFilesRecursive(dir, pattern) {
      try {
        const items = fs.readdirSync(dir)
        for (const item of items) {
          const fullPath = path.join(dir, item)
          const stat = fs.statSync(fullPath)
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            findFilesRecursive(fullPath, pattern)
          } else if (stat.isFile() && this.matchesPattern(item, pattern)) {
            files.push(fullPath)
          }
        }
      } catch (error) {
        // Directory not accessible, continue
      }
    }
    
    // Start from current directory
    findFilesRecursive('.', patterns)
    return files
  }
  
  matchesPattern(filename, patterns) {
    if (Array.isArray(patterns)) {
      return patterns.some(pattern => this.matchesPattern(filename, pattern))
    }
    
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.')
    const regex = new RegExp(regexPattern)
    return regex.test(filename)
  }

  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8')
    } catch (error) {
      return null
    }
  }

  fileExists(filePath) {
    return fs.existsSync(filePath)
  }

  addSuccess(message) {
    this.results.passed++
    console.log(`   ${message}`)
  }

  addIssue(type, message) {
    if (type === 'error') {
      this.results.failed++
    } else {
      this.results.warnings++
    }
    this.results.issues.push({ type, message })
    const icon = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'
    console.log(`   ${icon} ${message}`)
  }
}

// Run the checker
if (require.main === module) {
  const checker = new CodeQualityChecker()
  checker.run()
}

module.exports = CodeQualityChecker
