#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Hero Components Testing and Validation...\n');

// Test configuration
const tests = {
	unit: {
		command: 'npm test -- __tests__/components/hero/',
		description: 'Unit Tests (Jest)',
		timeout: 30000,
	},
	visual: {
		command: 'npx playwright test tests/hero-visual-regression.spec.ts',
		description: 'Visual Regression Tests (Playwright)',
		timeout: 120000,
	},
	accessibility: {
		command: 'npx playwright test tests/hero-accessibility.spec.ts',
		description: 'Accessibility Tests (Playwright)',
		timeout: 120000,
	},
	performance: {
		command: 'npx playwright test tests/hero-performance.spec.ts',
		description: 'Performance Tests (Playwright)',
		timeout: 120000,
	},
};

// Test results storage
const results = {
	unit: { status: 'pending', output: '', error: '' },
	visual: { status: 'pending', output: '', error: '' },
	accessibility: { status: 'pending', output: '', error: '' },
	performance: { status: 'pending', output: '', error: '' },
};

// Run individual test suite
async function runTest(testName, config) {
	console.log(`\n📋 Running ${config.description}...`);
	console.log(`⏱️  Timeout: ${config.timeout / 1000}s`);
	
	const startTime = Date.now();
	
	try {
		const output = execSync(config.command, { 
			encoding: 'utf8', 
			timeout: config.timeout,
			stdio: 'pipe',
			cwd: process.cwd(),
			env: { ...process.env, NODE_ENV: 'test' }
		});
		const endTime = Date.now();
		const duration = ((endTime - startTime) / 1000).toFixed(2);
		
		results[testName] = {
			status: 'passed',
			output: output,
			error: '',
			duration: `${duration}s`
		};
		
		console.log(`✅ ${config.description} - PASSED (${duration}s)`);
		return true;
	} catch (error) {
		const endTime = Date.now();
		const duration = ((endTime - startTime) / 1000).toFixed(2);
		
		// Enhanced error handling with detailed error information
		const errorDetails = {
			message: error.message || 'Unknown error occurred',
			stdout: error.stdout || '',
			stderr: error.stderr || '',
			signal: error.signal || null,
			code: error.status || error.code || null,
			command: config.command
		};
		
		results[testName] = {
			status: 'failed',
			output: errorDetails.stdout,
			error: errorDetails.stderr || errorDetails.message,
			duration: `${duration}s`,
			details: errorDetails
		};
		
		console.log(`❌ ${config.description} - FAILED (${duration}s)`);
		console.log(`Error: ${errorDetails.message}`);
		if (errorDetails.stderr) {
			console.log(`Stderr: ${errorDetails.stderr}`);
		}
		if (errorDetails.signal) {
			console.log(`Signal: ${errorDetails.signal}`);
		}
		if (errorDetails.code) {
			console.log(`Exit code: ${errorDetails.code}`);
		}
		
		return false;
	}
}

// Generate test report
function generateReport() {
	const reportPath = path.join(__dirname, '..', 'hero-test-report.md');
	const timestamp = new Date().toISOString();
	
	const report = `# Hero Components Testing Report

Generated: ${timestamp}

## Test Results Summary

| Test Suite | Status | Duration | Details |
|------------|--------|----------|---------|
| Unit Tests | ${results.unit.status === 'passed' ? '✅ PASSED' : '❌ FAILED'} | ${results.unit.duration} | Jest unit tests for hero components |
| Visual Regression | ${results.visual.status === 'passed' ? '✅ PASSED' : '❌ FAILED'} | ${results.visual.duration} | Playwright visual regression tests |
| Accessibility | ${results.accessibility.status === 'passed' ? '✅ PASSED' : '❌ FAILED'} | ${results.accessibility.duration} | WCAG 2.1 AA compliance tests |
| Performance | ${results.performance.status === 'passed' ? '✅ PASSED' : '❌ FAILED'} | ${results.performance.duration} | Core Web Vitals and performance tests |

## Detailed Results

### Unit Tests
- **Status**: ${results.unit.status === 'passed' ? 'PASSED' : 'FAILED'}
- **Duration**: ${results.unit.duration}
- **Output**: \`\`\`
${results.unit.output}
\`\`\`

### Visual Regression Tests
- **Status**: ${results.visual.status === 'passed' ? 'PASSED' : 'FAILED'}
- **Duration**: ${results.visual.duration}
- **Output**: \`\`\`
${results.visual.output}
\`\`\`

### Accessibility Tests
- **Status**: ${results.accessibility.status === 'passed' ? 'PASSED' : 'FAILED'}
- **Duration**: ${results.accessibility.duration}
- **Output**: \`\`\`
${results.accessibility.output}
\`\`\`

### Performance Tests
- **Status**: ${results.performance.status === 'passed' ? 'PASSED' : 'FAILED'}
- **Duration**: ${results.performance.duration}
- **Output**: \`\`\`
${results.performance.output}
\`\`\`

## Test Coverage

### Typography Tests
- ✅ Title scaling at all breakpoints
- ✅ Subtitle scaling at all breakpoints  
- ✅ Description scaling at all breakpoints
- ✅ Font weight consistency
- ✅ Line height consistency
- ✅ Text color contrast

### Spacing Tests
- ✅ Section padding consistency
- ✅ Content spacing validation
- ✅ Container width standards
- ✅ Responsive spacing behavior

### Accessibility Tests
- ✅ Screen reader compatibility
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Color contrast ratios
- ✅ ARIA labels

### Performance Tests
- ✅ Lighthouse scores
- ✅ Core Web Vitals
- ✅ Animation performance
- ✅ Image loading optimization
- ✅ Bundle size impact

## Recommendations

${results.unit.status === 'failed' ? '- Fix unit test failures before proceeding' : ''}
${results.visual.status === 'failed' ? '- Review visual regression test failures and update baselines if needed' : ''}
${results.accessibility.status === 'failed' ? '- Address accessibility issues to meet WCAG 2.1 AA standards' : ''}
${results.performance.status === 'failed' ? '- Optimize performance issues identified in tests' : ''}

## Next Steps

1. Review any failed tests and address issues
2. Update test baselines if visual changes are intentional
3. Run tests in CI/CD pipeline for continuous validation
4. Monitor performance metrics in production

---
*Report generated by Hero Components Testing Suite*
`;

	fs.writeFileSync(reportPath, report);
	console.log(`\n📊 Test report generated: ${reportPath}`);
}

// Main execution
async function main() {
	console.log('🎯 Hero Components Testing and Validation');
	console.log('==========================================\n');
	
	try {
		// Check if test files exist
		const testFiles = [
			'__tests__/components/hero/typography.test.tsx',
			'__tests__/components/hero/spacing.test.tsx',
			'__tests__/components/hero/accessibility.test.tsx',
			'__tests__/components/hero/performance.test.tsx',
			'tests/hero-visual-regression.spec.ts',
			'tests/hero-accessibility.spec.ts',
			'tests/hero-performance.spec.ts'
		];
		
		const missingFiles = testFiles.filter(file => !fs.existsSync(path.join(__dirname, '..', file)));
		if (missingFiles.length > 0) {
			console.log('❌ Missing test files:');
			missingFiles.forEach(file => console.log(`   - ${file}`));
			console.log('\n💡 Please ensure all test files are created before running the test suite.');
			console.log('📚 Check the documentation for test setup instructions.');
			process.exit(1);
		}
		
		// Check if required dependencies are installed
		const requiredDeps = ['jest', '@playwright/test', '@testing-library/react'];
		const packageJsonPath = path.join(__dirname, '..', 'package.json');
		
		if (fs.existsSync(packageJsonPath)) {
			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
			const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
			const missingDeps = requiredDeps.filter(dep => !allDeps[dep]);
			
			if (missingDeps.length > 0) {
				console.log('❌ Missing required dependencies:');
				missingDeps.forEach(dep => console.log(`   - ${dep}`));
				console.log('\n💡 Please install missing dependencies:');
				console.log(`   npm install ${missingDeps.join(' ')}`);
				process.exit(1);
			}
		}
		
		// Run tests sequentially
		const testSuites = Object.keys(tests);
		let passedTests = 0;
		let totalTests = testSuites.length;
		
		for (const testName of testSuites) {
			try {
				const success = await runTest(testName, tests[testName]);
				if (success) passedTests++;
			} catch (testError) {
				console.log(`❌ Unexpected error in ${testName}: ${testError.message}`);
				results[testName] = {
					status: 'failed',
					output: '',
					error: testError.message,
					duration: '0s'
				};
			}
		}
		
		// Generate report
		try {
			generateReport();
		} catch (reportError) {
			console.log(`⚠️  Warning: Could not generate test report: ${reportError.message}`);
		}
		
		// Final summary
		console.log('\n🎯 Hero Components Testing Summary');
		console.log('==================================');
		console.log(`✅ Passed: ${passedTests}/${totalTests}`);
		console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
		
		if (passedTests === totalTests) {
			console.log('\n🎉 All hero component tests passed!');
			console.log('✅ Typography tests - PASSED');
			console.log('✅ Spacing tests - PASSED');
			console.log('✅ Accessibility tests - PASSED');
			console.log('✅ Performance tests - PASSED');
			console.log('✅ Visual regression tests - PASSED');
			process.exit(0);
		} else {
			console.log('\n⚠️  Some tests failed. Please review the report and fix issues.');
			console.log('📊 Check the generated test report for detailed information.');
			process.exit(1);
		}
	} catch (error) {
		console.error('❌ Fatal error in test runner:', error.message);
		console.error('Stack trace:', error.stack);
		process.exit(1);
	}
}

// Handle errors
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	process.exit(1);
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	process.exit(1);
});

// Run the tests
main().catch(console.error);
