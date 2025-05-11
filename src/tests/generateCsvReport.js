import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { runEncryptionTests } from './encryption.test.js';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Run tests and get results
const testResults = runEncryptionTests();
const { results, summary } = testResults;

// Format test results as CSV
let csvContent = "No.,TC ID,TEST SCENARIO,PRE CONDITION,POST CONDITION,PRIORITY,COMMENTS\n";

results.forEach((result, index) => {
  const { testCase, result: testResult } = result;
  const status = testResult.passed ? "PASS" : "FAIL";
  const comments = testResult.passed 
    ? testCase.comments 
    : `${testCase.comments} - FAILED: ${testResult.message}`;
  
  // Format each row with commas between fields and escape any commas in the field content
  const row = [
    index + 1,
    testCase.id,
    escapeCsvField(testCase.scenario),
    escapeCsvField(testCase.precondition),
    escapeCsvField(testCase.postcondition),
    testCase.priority,
    escapeCsvField(comments)
  ].join(',');
  
  csvContent += row + '\n';
});

// Ensure the test-reports directory exists
const reportsDir = path.join(__dirname, '..', '..', 'test-reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Write CSV to file
const csvFilePath = path.join(reportsDir, 'encryption-test-report.csv');
fs.writeFileSync(csvFilePath, csvContent);

console.log(`CSV report generated: ${csvFilePath}`);
console.log(`Total tests: ${summary.total}, Passed: ${summary.passed}, Failed: ${summary.failed}`);

// Helper function to escape CSV field content
function escapeCsvField(field) {
  // If the field contains commas, quotes, or newlines, wrap it in quotes and escape any quotes
  const stringField = String(field);
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
}