#!/usr/bin/env node
/**
 * Definition of Done (DoD) Validation Script (Simplified)
 * 
 * This script validates DoD criteria by running existing npm scripts
 * and checking for successful completion.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DoDValidator {
  constructor() {
    this.results = [];
    this.projectRoot = process.cwd();
  }

  /**
   * Execute a command and return success/failure
   */
  runCommand(command, cwd) {
    try {
      const output = execSync(command, {
        encoding: 'utf-8',
        cwd: cwd || this.projectRoot,
        stdio: 'pipe',
      });
      return { success: true, output };
    } catch (error) {
      return { success: false, output: error.message || 'Command failed' };
    }
  }

  /**
   * Check if a file or directory exists
   */
  exists(filePath) {
    return fs.existsSync(path.join(this.projectRoot, filePath));
  }

  /**
   * Validate code quality (linting)
   */
  validateCodeQuality() {
    console.log('\n🎨 Validating Code Quality (linting)...\n');
    const result = {
      name: 'Code Quality',
      passed: false,
      details: [],
      errors: [],
    };

    // Frontend linting
    if (this.exists('frontend/package.json')) {
      const frontendLint = this.runCommand('npm run lint', path.join(this.projectRoot, 'frontend'));
      if (frontendLint.success) {
        result.details.push('✅ Frontend linting: PASSED');
      } else {
        result.details.push('⚠️  Frontend linting: FAILED');
        result.errors.push('Frontend linting errors found');
      }
    }

    result.passed = result.errors.length === 0;
    this.results.push(result);
    return result;
  }

  /**
   * Validate build succeeds
   */
  validateBuild() {
    console.log('\n🏗️  Validating Build...\n');
    const result = {
      name: 'Build Success',
      passed: false,
      details: [],
      errors: [],
    };

    // Frontend build
    if (this.exists('frontend/package.json')) {
      const frontendBuild = this.runCommand('npm run build', path.join(this.projectRoot, 'frontend'));
      if (frontendBuild.success) {
        result.details.push('✅ Frontend build: SUCCESS');
      } else {
        result.details.push('❌ Frontend build: FAILED');
        result.errors.push('Frontend build failed');
      }
    }

    // Backend build
    if (this.exists('backend/package.json')) {
      const backendBuild = this.runCommand('npm run build', path.join(this.projectRoot, 'backend'));
      if (backendBuild.success) {
        result.details.push('✅ Backend build: SUCCESS');
      } else {
        result.details.push('❌ Backend build: FAILED');
        result.errors.push('Backend build failed');
      }
    }

    result.passed = result.errors.length === 0;
    this.results.push(result);
    return result;
  }

  /**
   * Validate all tests passing
   */
  validateTests() {
    console.log('\n✅ Validating All Tests Pass...\n');
    const result = {
      name: 'All Tests Passing',
      passed: false,
      details: [],
      errors: [],
    };

    // Frontend tests
    if (this.exists('frontend/package.json')) {
      const frontendTest = this.runCommand('npm test', path.join(this.projectRoot, 'frontend'));
      if (frontendTest.success) {
        result.details.push('✅ Frontend tests: PASSED');
      } else {
        result.details.push('❌ Frontend tests: FAILED');
        result.errors.push('Frontend tests failed');
      }
    }

    // Backend tests
    if (this.exists('backend/package.json')) {
      const backendTest = this.runCommand('npm test', path.join(this.projectRoot, 'backend'));
      if (backendTest.success) {
        result.details.push('✅ Backend tests: PASSED');
      } else {
        result.details.push('❌ Backend tests: FAILED');
        result.errors.push('Backend tests failed');
      }
    }

    result.passed = result.errors.length === 0;
    this.results.push(result);
    return result;
  }

  /**
   * Validate security
   */
  validateSecurity() {
    console.log('\n🔒 Validating Security (0 high/critical vulnerabilities)...\n');
    const result = {
      name: 'Security Audit',
      passed: false,
      details: [],
      errors: [],
    };

    // Frontend audit
    if (this.exists('frontend/package.json')) {
      const frontendAudit = this.runCommand(
        'npm audit --audit-level=high',
        path.join(this.projectRoot, 'frontend')
      );
      if (frontendAudit.success) {
        result.details.push('✅ Frontend: No high/critical vulnerabilities');
      } else {
        result.details.push('⚠️  Frontend: High/critical vulnerabilities found');
        result.errors.push('Frontend has high/critical vulnerabilities');
      }
    }

    // Backend audit
    if (this.exists('backend/package.json')) {
      const backendAudit = this.runCommand(
        'npm audit --audit-level=high',
        path.join(this.projectRoot, 'backend')
      );
      if (backendAudit.success) {
        result.details.push('✅ Backend: No high/critical vulnerabilities');
      } else {
        result.details.push('⚠️  Backend: High/critical vulnerabilities found');
        result.errors.push('Backend has high/critical vulnerabilities');
      }
    }

    result.passed = result.errors.length === 0;
    this.results.push(result);
    return result;
  }

  /**
   * Validate documentation exists
   */
  validateDocumentation() {
    console.log('\n📚 Validating Documentation...\n');
    const result = {
      name: 'Documentation',
      passed: false,
      details: [],
      errors: [],
    };

    const requiredDocs = [
      'docs/DEFINITION_OF_DONE.md',
      'docs/DEFINITION_OF_READY.md',
      'docs/TECHNICAL_ARCHITECTURE.md',
      'docs/ACCESSIBILITY_REQUIREMENTS.md',
      'docs/BRANDING_GUIDELINE.md',
    ];

    requiredDocs.forEach((doc) => {
      if (this.exists(doc)) {
        result.details.push(`✅ ${doc} exists`);
      } else {
        result.details.push(`❌ ${doc} missing`);
        result.errors.push(`Missing required documentation: ${doc}`);
      }
    });

    result.passed = result.errors.length === 0;
    this.results.push(result);
    return result;
  }

  /**
   * Validate accessibility requirements
   */
  validateAccessibility() {
    console.log('\n♿ Validating Accessibility Compliance...\n');
    const result = {
      name: 'Accessibility (WCAG 2.1 AA)',
      passed: false,
      details: [],
      errors: [],
    };

    if (this.exists('docs/ACCESSIBILITY_REQUIREMENTS.md')) {
      result.details.push('✅ ACCESSIBILITY_REQUIREMENTS.md exists');
      result.passed = true;
    } else {
      result.errors.push('❌ ACCESSIBILITY_REQUIREMENTS.md not found');
    }

    result.details.push('ℹ️  Manual verification required for:');
    result.details.push('  - Keyboard navigation');
    result.details.push('  - Screen reader compatibility');
    result.details.push('  - Color contrast ratios');
    result.details.push('  - Focus indicators');

    this.results.push(result);
    return result;
  }

  /**
   * Validate GDPR compliance
   */
  validateGDPR() {
    console.log('\n🔐 Validating GDPR Compliance...\n');
    const result = {
      name: 'GDPR Compliance',
      passed: false,
      details: [],
      errors: [],
    };

    // Check for privacy policy documentation
    const privacyDocs = [
      'docs/user-stories/US-002-privacy-policy-gdpr-compliance.md',
    ];

    let hasPrivacyDoc = false;
    privacyDocs.forEach((doc) => {
      if (this.exists(doc)) {
        result.details.push(`✅ ${doc} exists`);
        hasPrivacyDoc = true;
      }
    });

    if (hasPrivacyDoc) {
      result.passed = true;
    } else {
      result.errors.push('Privacy policy documentation not found');
    }

    result.details.push('ℹ️  Manual verification required for:');
    result.details.push('  - Cookie consent implementation');
    result.details.push('  - Data encryption');
    result.details.push('  - User data export functionality');
    result.details.push('  - Data deletion requests');

    this.results.push(result);
    return result;
  }

  /**
   * Validate branding compliance
   */
  validateBranding() {
    console.log('\n🎨 Validating Branding Compliance...\n');
    const result = {
      name: 'Branding Guidelines',
      passed: false,
      details: [],
      errors: [],
    };

    if (this.exists('docs/BRANDING_GUIDELINE.md')) {
      result.details.push('✅ BRANDING_GUIDELINE.md exists');
      result.passed = true;
    } else {
      result.errors.push('❌ BRANDING_GUIDELINE.md not found');
    }

    result.details.push('ℹ️  Manual verification required for:');
    result.details.push('  - Color palette compliance');
    result.details.push('  - Typography usage');
    result.details.push('  - Logo placement and sizing');
    result.details.push('  - UI component consistency');

    this.results.push(result);
    return result;
  }

  /**
   * Generate DoD validation report
   */
  generateReport() {
    const passedChecks = this.results.filter((r) => r.passed).length;
    const failedChecks = this.results.length - passedChecks;

    const report = {
      timestamp: new Date().toISOString(),
      overallStatus: failedChecks === 0 ? 'PASS' : 'FAIL',
      results: this.results,
      summary: {
        totalChecks: this.results.length,
        passedChecks,
        failedChecks,
      },
    };

    return report;
  }

  /**
   * Print report to console
   */
  printReport(report) {
    console.log('\n' + '='.repeat(80));
    console.log('📋 DEFINITION OF DONE (DoD) VALIDATION REPORT');
    console.log('='.repeat(80));
    console.log(`\n⏰ Timestamp: ${report.timestamp}`);
    console.log(`\n📊 Overall Status: ${report.overallStatus === 'PASS' ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`\n📈 Summary:`);
    console.log(`   Total Checks: ${report.summary.totalChecks}`);
    console.log(`   Passed: ${report.summary.passedChecks} ✅`);
    console.log(`   Failed: ${report.summary.failedChecks} ❌`);

    console.log('\n' + '-'.repeat(80));
    console.log('📝 DETAILED RESULTS');
    console.log('-'.repeat(80));

    report.results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.name}: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);

      if (result.details.length > 0) {
        console.log('   Details:');
        result.details.forEach((detail) => console.log(`     ${detail}`));
      }

      if (result.errors.length > 0) {
        console.log('   ⚠️  Errors:');
        result.errors.forEach((error) => console.log(`     ❌ ${error}`));
      }
    });

    console.log('\n' + '='.repeat(80));

    if (report.overallStatus === 'PASS') {
      console.log('✅ ALL DEFINITION OF DONE CRITERIA MET');
      console.log('✅ READY FOR PRODUCTION DEPLOYMENT');
    } else {
      console.log('❌ DEFINITION OF DONE CRITERIA NOT MET');
      console.log('❌ ADDRESS FAILURES BEFORE DEPLOYMENT');
    }

    console.log('='.repeat(80) + '\n');
  }

  /**
   * Save report to file
   */
  saveReport(report) {
    const reportDir = path.join(this.projectRoot, 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, 'dod-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved to: ${reportPath}`);
  }

  /**
   * Run all DoD validations
   */
  runAll() {
    console.log('🚀 Starting Definition of Done (DoD) Validation...\n');

    // Run validations in order
    this.validateDocumentation();
    this.validateCodeQuality();
    this.validateBuild();
    this.validateTests();
    this.validateSecurity();
    this.validateAccessibility();
    this.validateGDPR();
    this.validateBranding();

    // Generate and display report
    const report = this.generateReport();
    this.printReport(report);
    this.saveReport(report);

    // Exit with appropriate code
    process.exit(report.overallStatus === 'PASS' ? 0 : 1);
  }
}

// Run if executed directly
if (require.main === module) {
  const validator = new DoDValidator();
  validator.runAll();
}

module.exports = { DoDValidator };
