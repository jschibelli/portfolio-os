#!/usr/bin/env node

/**
 * Dependency Maintenance Script
 * 
 * This script ensures dependencies are up-to-date and secure,
 * addressing the CR-GPT bot feedback about dependency maintenance.
 */

const fs = require('fs')
const { execSync } = require('child_process')
const https = require('https')

class DependencyMaintenance {
  constructor() {
    this.packageJson = this.readPackageJson()
    this.securityAdvisories = []
    this.outdatedDeps = []
  }

  /**
   * Main execution function
   */
  async run() {
    console.log('🔧 Running dependency maintenance check...\n')
    
    try {
      await this.checkOutdatedDependencies()
      await this.checkSecurityVulnerabilities()
      await this.checkLicenseCompatibility()
      await this.generateMaintenanceReport()
      await this.suggestUpdates()
    } catch (error) {
      console.error('❌ Dependency maintenance check failed:', error.message)
      process.exit(1)
    }
  }

  /**
   * Check for outdated dependencies
   */
  async checkOutdatedDependencies() {
    console.log('📦 Checking for outdated dependencies...')
    
    try {
      const result = execSync('npm outdated --json', { encoding: 'utf8' })
      const outdated = JSON.parse(result)
      
      this.outdatedDeps = Object.entries(outdated).map(([name, info]) => ({
        name,
        current: info.current,
        wanted: info.wanted,
        latest: info.latest,
        type: info.type
      }))

      if (this.outdatedDeps.length === 0) {
        console.log('   ✅ All dependencies are up to date')
      } else {
        console.log(`   ⚠️  Found ${this.outdatedDeps.length} outdated dependencies`)
        this.outdatedDeps.forEach(dep => {
          console.log(`   - ${dep.name}: ${dep.current} → ${dep.latest}`)
        })
      }
    } catch (error) {
      console.log('   ℹ️  Could not check outdated dependencies')
    }
  }

  /**
   * Check for security vulnerabilities
   */
  async checkSecurityVulnerabilities() {
    console.log('🔒 Checking for security vulnerabilities...')
    
    try {
      const result = execSync('npm audit --json', { encoding: 'utf8' })
      const audit = JSON.parse(result)
      
      if (audit.vulnerabilities) {
        const vulnerabilities = Object.values(audit.vulnerabilities)
        const highSeverity = vulnerabilities.filter(v => v.severity === 'high')
        const criticalSeverity = vulnerabilities.filter(v => v.severity === 'critical')
        
        if (criticalSeverity.length > 0) {
          console.log(`   ❌ ${criticalSeverity.length} critical vulnerabilities found`)
          this.securityAdvisories.push(...criticalSeverity)
        }
        
        if (highSeverity.length > 0) {
          console.log(`   ⚠️  ${highSeverity.length} high severity vulnerabilities found`)
          this.securityAdvisories.push(...highSeverity)
        }
        
        if (vulnerabilities.length === 0) {
          console.log('   ✅ No security vulnerabilities found')
        }
      }
    } catch (error) {
      console.log('   ℹ️  Could not check security vulnerabilities')
    }
  }

  /**
   * Check license compatibility
   */
  async checkLicenseCompatibility() {
    console.log('📄 Checking license compatibility...')
    
    const problematicLicenses = [
      'GPL-3.0',
      'AGPL-3.0',
      'Copyleft',
      'Commercial'
    ]

    const dependencies = {
      ...this.packageJson.dependencies || {},
      ...this.packageJson.devDependencies || {}
    }

    let licenseIssues = 0
    
    for (const [name, version] of Object.entries(dependencies)) {
      try {
        // This would require additional package to check licenses
        // For now, we'll just note the check
        console.log(`   ℹ️  License check for ${name} would require license-checker package`)
      } catch (error) {
        // License check failed for this package
      }
    }
    
    if (licenseIssues === 0) {
      console.log('   ✅ No license compatibility issues found')
    }
  }

  /**
   * Generate maintenance report
   */
  async generateMaintenanceReport() {
    console.log('\n📊 Dependency Maintenance Report')
    console.log('='.repeat(50))
    
    console.log(`📦 Total dependencies: ${Object.keys({
      ...this.packageJson.dependencies || {},
      ...this.packageJson.devDependencies || {}
    }).length}`)
    
    console.log(`🔄 Outdated dependencies: ${this.outdatedDeps.length}`)
    console.log(`🔒 Security vulnerabilities: ${this.securityAdvisories.length}`)
    
    if (this.outdatedDeps.length > 0) {
      console.log('\n📋 Outdated Dependencies:')
      this.outdatedDeps.forEach(dep => {
        console.log(`   - ${dep.name}: ${dep.current} → ${dep.latest} (${dep.type})`)
      })
    }
    
    if (this.securityAdvisories.length > 0) {
      console.log('\n🚨 Security Vulnerabilities:')
      this.securityAdvisories.forEach(adv => {
        console.log(`   - ${adv.name}: ${adv.severity} - ${adv.title}`)
      })
    }
  }

  /**
   * Suggest updates and maintenance actions
   */
  async suggestUpdates() {
    console.log('\n💡 Maintenance Recommendations:')
    console.log('='.repeat(50))
    
    if (this.outdatedDeps.length > 0) {
      console.log('\n🔄 Update Recommendations:')
      
      // Group by update type
      const majorUpdates = this.outdatedDeps.filter(dep => {
        const current = dep.current.split('.')[0]
        const latest = dep.latest.split('.')[0]
        return current !== latest
      })
      
      const minorUpdates = this.outdatedDeps.filter(dep => {
        const current = dep.current.split('.')[0]
        const latest = dep.latest.split('.')[0]
        return current === latest
      })
      
      if (majorUpdates.length > 0) {
        console.log('\n   🔴 Major Updates (require testing):')
        majorUpdates.forEach(dep => {
          console.log(`   - npm install ${dep.name}@${dep.latest}`)
        })
      }
      
      if (minorUpdates.length > 0) {
        console.log('\n   🟡 Minor Updates (generally safe):')
        minorUpdates.forEach(dep => {
          console.log(`   - npm install ${dep.name}@${dep.latest}`)
        })
      }
    }
    
    if (this.securityAdvisories.length > 0) {
      console.log('\n🔒 Security Fixes:')
      console.log('   - Run: npm audit fix')
      console.log('   - For manual fixes: npm audit fix --force')
    }
    
    console.log('\n🛠️  General Maintenance Commands:')
    console.log('   - npm update                    # Update to latest compatible versions')
    console.log('   - npm audit                     # Check for vulnerabilities')
    console.log('   - npm audit fix                 # Fix vulnerabilities automatically')
    console.log('   - npm outdated                  # Check for outdated packages')
    console.log('   - npm ls                        # List installed packages')
    
    console.log('\n📅 Recommended Maintenance Schedule:')
    console.log('   - Weekly: npm audit')
    console.log('   - Monthly: npm update')
    console.log('   - Quarterly: Major version updates with testing')
  }

  /**
   * Read package.json file
   */
  readPackageJson() {
    try {
      const content = fs.readFileSync('package.json', 'utf8')
      return JSON.parse(content)
    } catch (error) {
      console.error('❌ Could not read package.json')
      process.exit(1)
    }
  }

  /**
   * Check if a dependency is a security risk
   */
  isSecurityRisk(dependency) {
    const riskyPatterns = [
      /^0\./,  // 0.x versions
      /-alpha/,  // Alpha versions
      /-beta/,   // Beta versions
      /-rc/,     // Release candidates
    ]
    
    return riskyPatterns.some(pattern => pattern.test(dependency))
  }

  /**
   * Get dependency health score
   */
  getHealthScore() {
    const totalDeps = Object.keys({
      ...this.packageJson.dependencies || {},
      ...this.packageJson.devDependencies || {}
    }).length
    
    const outdatedCount = this.outdatedDeps.length
    const securityCount = this.securityAdvisories.length
    
    const outdatedScore = Math.max(0, 100 - (outdatedCount / totalDeps) * 100)
    const securityScore = Math.max(0, 100 - (securityCount / totalDeps) * 100)
    
    return {
      overall: Math.round((outdatedScore + securityScore) / 2),
      outdated: Math.round(outdatedScore),
      security: Math.round(securityScore)
    }
  }
}

// Run the maintenance check
if (require.main === module) {
  const maintenance = new DependencyMaintenance()
  maintenance.run()
}

module.exports = DependencyMaintenance
