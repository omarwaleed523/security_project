import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { runEncryptionTests, generateHtmlReport, generateTestReport } from './encryption.test';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Run all tests and generate reports
const htmlReport = generateHtmlReport();
const csvReport = generateTestReport();

// Create tests directory if it doesn't exist
const reportsDir = path.join(__dirname, '..', '..', 'test-reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Write the HTML report
fs.writeFileSync(path.join(reportsDir, 'encryption-test-report.html'), htmlReport);
console.log(`HTML report saved to ${path.join(reportsDir, 'encryption-test-report.html')}`);

// Write the CSV report
fs.writeFileSync(path.join(reportsDir, 'encryption-test-report.csv'), csvReport);
console.log(`CSV report saved to ${path.join(reportsDir, 'encryption-test-report.csv')}`);

// Also print test results to console
const testResults = runEncryptionTests();
const { summary } = testResults;

console.log('\n===== ENCRYPTION TESTS SUMMARY =====');
console.log(`Total Tests: ${summary.total}`);
console.log(`Passed: ${summary.passed}`);
console.log(`Failed: ${summary.failed}`);
console.log('===================================');

// Print detailed results
console.log('DETAILED RESULTS:');
testResults.results.forEach((result, index) => {
  const { testCase, result: testResult } = result;
  const status = testResult.passed ? 'PASS' : 'FAIL';
  console.log(`${index + 1}. [${status}] ${testCase.id} - ${testCase.name}`);
  
  if (!testResult.passed) {
    console.log(`   Error: ${testResult.message}`);
  }
});

// Exit with appropriate code based on test results
process.exit(summary.failed > 0 ? 1 : 0);