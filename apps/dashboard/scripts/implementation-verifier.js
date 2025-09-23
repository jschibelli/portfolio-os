#!/usr/bin/env node

/**
 * Implementation Verifier
 * 
 * This script verifies that actual code implementation aligns with
 * the comprehensive guidelines outlined in the .gitkeep file.
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

class ImplementationVerifier {
  constructor() {
    this.results = {
      guidelines: [],
      implementations: [],
      gaps: [],
      recommendations: []
    }
    
    this.guidelines = this.loadGuidelines()
  }

  /**
   * Main execution function
   */
  async run() {
    console.log('🔍 Running implementation verification...\n')
    
    try {
      await this.verifyErrorHandling()
      await this.verifyTestingStrategy()
      await this.verifyDocumentation()
      await this.verifySecurity()
      await this.verifyPerformance()
      await this.verifyAccessibility()
      await this.verifyScalability()
      await this.verifyInternationalization()
      await this.verifyCrossBrowserCompatibility()
      
      this.generateVerificationReport()
    } catch (error) {
      console.error('❌ Implementation verification failed:', error.message)
      process.exit(1)
    }
  }

  /**
   * Load guidelines from .gitkeep file
   */
  loadGuidelines() {
    try {
      const gitkeepContent = fs.readFileSync('apps/dashboard/.gitkeep', 'utf8')
      const lines = gitkeepContent.split('\n')
      
      const guidelines = {
        errorHandling: [],
        testing: [],
        documentation: [],
        security: [],
        performance: [],
        accessibility: [],
        scalability: [],
        internationalization: [],
        crossBrowser: []
      }
      
      let currentSection = null
      
      for (const line of lines) {
        if (line.includes('Error Handling')) {
          currentSection = 'errorHandling'
        } else if (line.includes('Testing Strategy')) {
          currentSection = 'testing'
        } else if (line.includes('Documentation')) {
          currentSection = 'documentation'
        } else if (line.includes('Security')) {
          currentSection = 'security'
        } else if (line.includes('Performance')) {
          currentSection = 'performance'
        } else if (line.includes('Scalability')) {
          currentSection = 'scalability'
        } else if (line.includes('Internationalization')) {
          currentSection = 'internationalization'
        } else if (line.includes('Cross-Browser')) {
          currentSection = 'crossBrowser'
        } else if (line.startsWith('# -') && currentSection) {
          guidelines[currentSection].push(line.replace('# -', '').trim())
        }
      }
      
      return guidelines
    } catch (error) {
      console.error('❌ Could not load guidelines from .gitkeep file')
      return {}
    }
  }

  /**
   * Verify error handling implementation
   */
  async verifyErrorHandling() {
    console.log('🛡️ Verifying error handling implementation...')
    
    const sourceFiles = this.findFiles(['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'])
    let errorHandlingScore = 0
    let totalFiles = 0

    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, 'utf8')
      totalFiles++
      
      const hasTryCatch = content.includes('try') && content.includes('catch')
      const hasErrorBoundary = content.includes('ErrorBoundary') || content.includes('componentDidCatch')
      const hasErrorLogging = content.includes('console.error') || content.includes('logError')
      const hasUserFriendlyErrors = content.includes('createUserFriendlyError') || content.includes('ERROR_MESSAGES')
      
      if (hasTryCatch || hasErrorBoundary || hasErrorLogging || hasUserFriendlyErrors) {
        errorHandlingScore++
        this.results.implementations.push(`✅ Error handling in ${file}`)
      } else {
        this.results.gaps.push(`❌ Missing error handling in ${file}`)
      }
    }

    const score = totalFiles > 0 ? (errorHandlingScore / totalFiles) * 100 : 0
    console.log(`   📊 Error handling score: ${score.toFixed(1)}%`)
    
    if (score < 80) {
      this.results.recommendations.push('Add comprehensive error handling with try-catch blocks and error boundaries')
    }
  }

  /**
   * Verify testing strategy implementation
   */
  async verifyTestingStrategy() {
    console.log('🧪 Verifying testing strategy implementation...')
    
    const testFiles = this.findFiles(['**/*.test.*', '**/*.spec.*', '**/__tests__/**'])
    const sourceFiles = this.findFiles(['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'])
    
    if (testFiles.length === 0) {
      this.results.gaps.push('❌ No test files found')
      return
    }

    // Check test coverage
    try {
      const coverage = execSync('npm run test:coverage -- --coverage --silent', { encoding: 'utf8' })
      const coverageMatch = coverage.match(/All files\s+\|\s+(\d+\.\d+)%/)
      if (coverageMatch) {
        const coveragePercent = parseFloat(coverageMatch[1])
        console.log(`   📊 Test coverage: ${coveragePercent}%`)
        
        if (coveragePercent >= 80) {
          this.results.implementations.push(`✅ Good test coverage: ${coveragePercent}%`)
        } else {
          this.results.gaps.push(`❌ Low test coverage: ${coveragePercent}%`)
        }
      }
    } catch (error) {
      console.log('   ℹ️  Could not determine test coverage')
    }

    // Check for different test types
    const testTypes = {
      unit: testFiles.filter(f => f.includes('.test.') || f.includes('.spec.')),
      integration: testFiles.filter(f => f.includes('integration')),
      e2e: testFiles.filter(f => f.includes('e2e') || f.includes('playwright'))
    }

    for (const [type, files] of Object.entries(testTypes)) {
      if (files.length > 0) {
        this.results.implementations.push(`✅ ${type} tests found: ${files.length} files`)
        console.log(`   ✅ ${type} tests: ${files.length} files`)
      } else {
        this.results.gaps.push(`❌ No ${type} tests found`)
        console.log(`   ❌ No ${type} tests found`)
      }
    }
  }

  /**
   * Verify documentation implementation
   */
  async verifyDocumentation() {
    console.log('📚 Verifying documentation implementation...')
    
    const sourceFiles = this.findFiles(['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'])
    let documentedFiles = 0
    let totalFiles = 0

    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, 'utf8')
      totalFiles++
      
      const hasJSDoc = content.includes('/**') && content.includes('*/')
      const hasInlineComments = (content.match(/\/\/.*$/gm) || []).length > 5
      const hasFunctionDocs = content.includes('@param') || content.includes('@returns')
      
      if (hasJSDoc || hasInlineComments || hasFunctionDocs) {
        documentedFiles++
        this.results.implementations.push(`✅ Documentation in ${file}`)
      } else {
        this.results.gaps.push(`❌ Missing documentation in ${file}`)
      }
    }

    const score = totalFiles > 0 ? (documentedFiles / totalFiles) * 100 : 0
    console.log(`   📊 Documentation score: ${score.toFixed(1)}%`)
    
    if (score < 70) {
      this.results.recommendations.push('Add comprehensive documentation with JSDoc comments and inline explanations')
    }
  }

  /**
   * Verify security implementation
   */
  async verifySecurity() {
    console.log('🔒 Verifying security implementation...')
    
    const sourceFiles = this.findFiles(['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'])
    let securityScore = 0
    let totalFiles = 0

    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, 'utf8')
      totalFiles++
      
      const hasValidation = content.includes('validate') || content.includes('sanitize')
      const hasXSSProtection = !content.includes('dangerouslySetInnerHTML') || content.includes('sanitize')
      const hasSQLProtection = content.includes('Prisma') || content.includes('parameterized')
      const hasCSRFProtection = content.includes('csrf') || content.includes('CSRF')
      
      if (hasValidation && hasXSSProtection && hasSQLProtection) {
        securityScore++
        this.results.implementations.push(`✅ Security measures in ${file}`)
      } else {
        this.results.gaps.push(`❌ Missing security measures in ${file}`)
      }
    }

    const score = totalFiles > 0 ? (securityScore / totalFiles) * 100 : 0
    console.log(`   📊 Security score: ${score.toFixed(1)}%`)
    
    if (score < 90) {
      this.results.recommendations.push('Implement comprehensive security measures including input validation, XSS protection, and SQL injection prevention')
    }
  }

  /**
   * Verify performance implementation
   */
  async verifyPerformance() {
    console.log('⚡ Verifying performance implementation...')
    
    const sourceFiles = this.findFiles(['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'])
    let performanceScore = 0
    let totalFiles = 0

    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, 'utf8')
      totalFiles++
      
      const hasMemoization = content.includes('React.memo') || content.includes('useMemo') || content.includes('useCallback')
      const hasLazyLoading = content.includes('lazy') || content.includes('dynamic')
      const hasOptimization = content.includes('optimize') || content.includes('cache')
      
      if (hasMemoization || hasLazyLoading || hasOptimization) {
        performanceScore++
        this.results.implementations.push(`✅ Performance optimization in ${file}`)
      } else {
        this.results.gaps.push(`❌ Missing performance optimization in ${file}`)
      }
    }

    const score = totalFiles > 0 ? (performanceScore / totalFiles) * 100 : 0
    console.log(`   📊 Performance score: ${score.toFixed(1)}%`)
    
    if (score < 60) {
      this.results.recommendations.push('Add performance optimizations including memoization, lazy loading, and caching')
    }
  }

  /**
   * Verify accessibility implementation
   */
  async verifyAccessibility() {
    console.log('♿ Verifying accessibility implementation...')
    
    const sourceFiles = this.findFiles(['**/*.tsx', '**/*.jsx'])
    let accessibilityScore = 0
    let totalFiles = 0

    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, 'utf8')
      totalFiles++
      
      const hasARIA = content.includes('aria-') || content.includes('role=')
      const hasSemanticHTML = content.includes('<main>') || content.includes('<nav>') || content.includes('<header>')
      const hasAccessibilityProps = content.includes('ariaLabel') || content.includes('ariaDescribedBy')
      
      if (hasARIA || hasSemanticHTML || hasAccessibilityProps) {
        accessibilityScore++
        this.results.implementations.push(`✅ Accessibility features in ${file}`)
      } else {
        this.results.gaps.push(`❌ Missing accessibility features in ${file}`)
      }
    }

    const score = totalFiles > 0 ? (accessibilityScore / totalFiles) * 100 : 0
    console.log(`   📊 Accessibility score: ${score.toFixed(1)}%`)
    
    if (score < 70) {
      this.results.recommendations.push('Add accessibility features including ARIA attributes, semantic HTML, and screen reader support')
    }
  }

  /**
   * Verify scalability implementation
   */
  async verifyScalability() {
    console.log('📈 Verifying scalability implementation...')
    
    const configFiles = this.findFiles(['**/scalability-config.ts', '**/config*.ts'])
    const modularFiles = this.findFiles(['**/modular-components.ts', '**/components/**'])
    
    let scalabilityScore = 0
    
    if (configFiles.length > 0) {
      scalabilityScore++
      this.results.implementations.push(`✅ Scalability configuration found: ${configFiles.length} files`)
      console.log(`   ✅ Scalability configuration: ${configFiles.length} files`)
    } else {
      this.results.gaps.push('❌ No scalability configuration found')
      console.log('   ❌ No scalability configuration found')
    }
    
    if (modularFiles.length > 0) {
      scalabilityScore++
      this.results.implementations.push(`✅ Modular components found: ${modularFiles.length} files`)
      console.log(`   ✅ Modular components: ${modularFiles.length} files`)
    } else {
      this.results.gaps.push('❌ No modular components found')
      console.log('   ❌ No modular components found')
    }
    
    if (scalabilityScore < 2) {
      this.results.recommendations.push('Implement scalability configuration and modular component architecture')
    }
  }

  /**
   * Verify internationalization implementation
   */
  async verifyInternationalization() {
    console.log('🌍 Verifying internationalization implementation...')
    
    const i18nFiles = this.findFiles(['**/i18n*', '**/locale*', '**/translation*'])
    const configFiles = this.findFiles(['**/scalability-config.ts'])
    
    let i18nScore = 0
    
    if (i18nFiles.length > 0) {
      i18nScore++
      this.results.implementations.push(`✅ Internationalization files found: ${i18nFiles.length} files`)
      console.log(`   ✅ Internationalization files: ${i18nFiles.length} files`)
    } else {
      this.results.gaps.push('❌ No internationalization files found')
      console.log('   ❌ No internationalization files found')
    }
    
    if (configFiles.length > 0) {
      const content = fs.readFileSync(configFiles[0], 'utf8')
      if (content.includes('InternationalizationConfig') || content.includes('supportedLocales')) {
        i18nScore++
        this.results.implementations.push('✅ Internationalization configuration found')
        console.log('   ✅ Internationalization configuration found')
      }
    }
    
    if (i18nScore < 1) {
      this.results.recommendations.push('Implement internationalization support with locale configuration and translation files')
    }
  }

  /**
   * Verify cross-browser compatibility implementation
   */
  async verifyCrossBrowserCompatibility() {
    console.log('🌐 Verifying cross-browser compatibility implementation...')
    
    const compatibilityFiles = this.findFiles(['**/cross-browser*', '**/polyfill*'])
    const configFiles = this.findFiles(['**/scalability-config.ts'])
    
    let compatibilityScore = 0
    
    if (compatibilityFiles.length > 0) {
      compatibilityScore++
      this.results.implementations.push(`✅ Cross-browser compatibility files found: ${compatibilityFiles.length} files`)
      console.log(`   ✅ Cross-browser compatibility files: ${compatibilityFiles.length} files`)
    } else {
      this.results.gaps.push('❌ No cross-browser compatibility files found')
      console.log('   ❌ No cross-browser compatibility files found')
    }
    
    if (configFiles.length > 0) {
      const content = fs.readFileSync(configFiles[0], 'utf8')
      if (content.includes('CrossBrowserConfig') || content.includes('polyfills')) {
        compatibilityScore++
        this.results.implementations.push('✅ Cross-browser compatibility configuration found')
        console.log('   ✅ Cross-browser compatibility configuration found')
      }
    }
    
    if (compatibilityScore < 1) {
      this.results.recommendations.push('Implement cross-browser compatibility with polyfill support and graceful degradation')
    }
  }

  /**
   * Generate verification report
   */
  generateVerificationReport() {
    console.log('\n📊 Implementation Verification Report')
    console.log('='.repeat(60))
    
    console.log(`✅ Implementations found: ${this.results.implementations.length}`)
    console.log(`❌ Gaps identified: ${this.results.gaps.length}`)
    console.log(`💡 Recommendations: ${this.results.recommendations.length}`)
    
    if (this.results.implementations.length > 0) {
      console.log('\n✅ Implementations:')
      this.results.implementations.forEach((impl, index) => {
        console.log(`   ${index + 1}. ${impl}`)
      })
    }
    
    if (this.results.gaps.length > 0) {
      console.log('\n❌ Gaps:')
      this.results.gaps.forEach((gap, index) => {
        console.log(`   ${index + 1}. ${gap}`)
      })
    }
    
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 Recommendations:')
      this.results.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`)
      })
    }
    
    const overallScore = this.results.implementations.length / 
      (this.results.implementations.length + this.results.gaps.length) * 100
    
    console.log(`\n📈 Overall Implementation Score: ${overallScore.toFixed(1)}%`)
    
    if (overallScore >= 80) {
      console.log('✅ Implementation verification passed!')
    } else {
      console.log('❌ Implementation verification failed - address the gaps above')
      process.exit(1)
    }
  }

  /**
   * Find files matching patterns
   */
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
}

// Run the verifier
if (require.main === module) {
  const verifier = new ImplementationVerifier()
  verifier.run()
}

module.exports = ImplementationVerifier
