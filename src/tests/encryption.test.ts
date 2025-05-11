import { encryptAES, decryptAES } from '../algorithms/aes';
import { encryptAutokey, decryptAutokey } from '../algorithms/autokey';
import { encryptVigenere, decryptVigenere } from '../algorithms/vigenere';
import { formatToHex, formatFromHex, isValidHex } from '../utils/formatters';

export interface TestCase {
  id: string;
  name: string;
  scenario: string;
  precondition: string;
  postcondition: string;
  priority: 'High' | 'Medium' | 'Low';
  comments: string;
  execute: () => { passed: boolean; message: string };
}

// AES Encryption Test Cases
const aesTests: TestCase[] = [
  {
    id: "TAES-001",
    name: "AES Basic Encryption/Decryption",
    scenario: "Test basic AES encryption and decryption with text key",
    precondition: "Valid text input and encryption key",
    postcondition: "Input text is encrypted and then successfully decrypted back to original",
    priority: "High",
    comments: "Core encryption/decryption functionality test",
    execute: () => {
      const plaintext = "Hello World!";
      const key = "mysecretkey12345";
      const encrypted = encryptAES(plaintext, key);
      const decrypted = decryptAES(encrypted, key);
      
      const passed = plaintext === decrypted;
      return {
        passed,
        message: passed 
          ? `AES encryption/decryption successful: "${plaintext}" -> "${encrypted}" -> "${decrypted}"`
          : `AES decryption failed: "${plaintext}" -> "${encrypted}" -> "${decrypted}"`
      };
    }
  },
  {
    id: "TAES-002",
    name: "AES Encryption with Hex Key",
    scenario: "Verify using a hexadecimal key correctly encrypts and decrypts data",
    precondition: "Valid input text and hexadecimal encryption key",
    postcondition: "Input text is encrypted with hex key and successfully decrypted",
    priority: "Medium",
    comments: "Tests alternative key format functionality",
    execute: () => {
      const plaintext = "Test message";
      const hexKey = "0123456789abcdef0123456789abcdef";
      const encrypted = encryptAES(plaintext, hexKey, 'hex');
      const decrypted = decryptAES(encrypted, hexKey, 'hex');
      
      const passed = plaintext === decrypted;
      return {
        passed,
        message: passed 
          ? `AES hex key encryption/decryption successful: "${plaintext}" -> "${encrypted}" -> "${decrypted}"`
          : `AES hex key decryption failed: "${plaintext}" -> "${encrypted}" -> "${decrypted}"`
      };
    }
  },
  {
    id: "TAES-003",
    name: "AES Key Length Handling",
    scenario: "Test handling of short and long encryption keys",
    precondition: "Encryption keys shorter and longer than ideal 16 bytes",
    postcondition: "Keys are properly padded or truncated and encryption works correctly",
    priority: "High",
    comments: "Validates key preprocessing functionality",
    execute: () => {
      // Test short key (should be padded)
      const shortKey = "short";
      // Test long key (should be truncated)
      const longKey = "thisisaverylongkeythatwillbetruncated";
      const plaintext = "Test with different key lengths";
      
      try {
        const encryptedShort = encryptAES(plaintext, shortKey);
        const decryptedShort = decryptAES(encryptedShort, shortKey);
        
        const encryptedLong = encryptAES(plaintext, longKey);
        const decryptedLong = decryptAES(encryptedLong, longKey);
        
        const passedShort = plaintext === decryptedShort;
        const passedLong = plaintext === decryptedLong;
        
        return {
          passed: passedShort && passedLong,
          message: passedShort && passedLong
            ? `Key length handling successful: Short key and long key both work correctly`
            : `Key length handling failed: Short key: ${passedShort}, Long key: ${passedLong}`
        };
      } catch (error) {
        return {
          passed: false,
          message: `Key length test failed with error: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    }
  },
  {
    id: "TAES-004",
    name: "AES Empty Input Handling",
    scenario: "Test encryption and decryption with empty input",
    precondition: "Empty input string",
    postcondition: "Function handles empty input gracefully without errors",
    priority: "Medium",
    comments: "Robustness test for edge cases",
    execute: () => {
      try {
        const key = "testkey12345";
        const encrypted = encryptAES("", key);
        const decrypted = decryptAES(encrypted, key);
        
        return {
          passed: decrypted === "",
          message: decrypted === ""
            ? "Empty input handled correctly"
            : `Empty input test failed: expected "", got "${decrypted}"`
        };
      } catch (error) {
        return {
          passed: false,
          message: `Empty input test failed with error: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    }
  }
];

// Autokey Cipher Test Cases
const autokeyTests: TestCase[] = [
  {
    id: "TAUT-001",
    name: "Autokey Basic Encryption/Decryption",
    scenario: "Test basic autokey encryption and decryption with a simple key",
    precondition: "Valid text input and alphabetic encryption key",
    postcondition: "Input text is encrypted and successfully decrypted back to original",
    priority: "High",
    comments: "Core functionality test",
    execute: () => {
      const plaintext = "ATTACKATDAWN";
      const key = "KEY";
      const encrypted = encryptAutokey(plaintext, key);
      const decrypted = decryptAutokey(encrypted, key);
      
      const passed = normalizeText(plaintext) === decrypted;
      return {
        passed,
        message: passed 
          ? `Autokey encryption/decryption successful: "${plaintext}" -> "${encrypted}" -> "${decrypted}"`
          : `Autokey decryption failed: "${plaintext}" -> "${encrypted}" -> "${decrypted}"`
      };
    }
  },
  {
    id: "TAUT-002",
    name: "Autokey Case Insensitivity",
    scenario: "Verify autokey works with mixed case and normalizes properly",
    precondition: "Mixed case input text with special characters",
    postcondition: "Text is normalized and properly encrypted/decrypted",
    priority: "Medium",
    comments: "Tests text normalization behavior",
    execute: () => {
      const plaintext = "Hello World with Special Ch@racters!";
      const key = "Secret";
      const encrypted = encryptAutokey(plaintext, key);
      const decrypted = decryptAutokey(encrypted, key);
      
      // Normalize the plaintext for comparison (uppercase, only letters)
      const normalizedPlaintext = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
      
      const passed = normalizedPlaintext === decrypted;
      return {
        passed,
        message: passed 
          ? `Autokey case handling successful: "${plaintext}" -> "${normalizedPlaintext}" -> "${encrypted}" -> "${decrypted}"`
          : `Autokey case handling failed: "${plaintext}" -> "${normalizedPlaintext}" -> "${encrypted}" -> "${decrypted}"`
      };
    }
  },
  {
    id: "TAUT-003",
    name: "Autokey Empty Input Handling",
    scenario: "Ensure autokey properly handles empty inputs",
    precondition: "Empty input string or empty key",
    postcondition: "Empty input returns empty output, empty key throws error",
    priority: "Medium", 
    comments: "Tests edge case handling",
    execute: () => {
      try {
        const emptyResult = encryptAutokey('', 'KEY');
        const emptyKeyTest = (() => {
          try {
            encryptAutokey('TEST', '');
            return false; // Should have thrown an error
          } catch (e) {
            return true; // Successfully caught the error
          }
        })();
        
        return {
          passed: emptyResult === '' && emptyKeyTest,
          message: emptyResult === '' && emptyKeyTest
            ? `Empty input handling successful: Empty text returns empty result and empty key throws error`
            : `Empty input handling failed: Empty text: ${emptyResult === ''}, Empty key throws error: ${emptyKeyTest}`
        };
      } catch (error) {
        return {
          passed: false,
          message: `Empty input test failed with error: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    }
  },
  {
    id: "TAUT-004",
    name: "Autokey Long Text Encryption",
    scenario: "Test encryption of longer text passages",
    precondition: "Long input text with a short key",
    postcondition: "Long text is correctly encrypted and decrypted",
    priority: "Low",
    comments: "Tests performance with larger inputs",
    execute: () => {
      const plaintext = "THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG";
      const key = "CRYPTO";
      const encrypted = encryptAutokey(plaintext, key);
      const decrypted = decryptAutokey(encrypted, key);
      
      const passed = normalizeText(plaintext) === decrypted;
      return {
        passed,
        message: passed 
          ? `Autokey long text encryption successful: "${plaintext}" -> "${encrypted}" -> "${decrypted}"`
          : `Autokey long text encryption failed: "${plaintext}" -> "${encrypted}" -> "${decrypted}"`
      };
    }
  }
];

// Vigenère Cipher Test Cases
const vigenereTests: TestCase[] = [
  {
    id: "TVIG-001",
    name: "Vigenère Basic Encryption/Decryption",
    scenario: "Test basic Vigenère encryption and decryption with a simple key",
    precondition: "Valid text input and alphabetic encryption key",
    postcondition: "Input text is encrypted and successfully decrypted back to original",
    priority: "High",
    comments: "Core functionality test",
    execute: () => {
      const plaintext = "ATTACKATDAWN";
      const key = "LEMON";
      const encrypted = encryptVigenere(plaintext, key);
      const decrypted = decryptVigenere(encrypted, key);
      
      const passed = normalizeText(plaintext) === decrypted;
      return {
        passed,
        message: passed 
          ? `Vigenère encryption/decryption successful: "${plaintext}" -> "${encrypted}" -> "${decrypted}"`
          : `Vigenère decryption failed: "${plaintext}" -> "${encrypted}" -> "${decrypted}"`
      };
    }
  },
  {
    id: "TVIG-002",
    name: "Vigenère with Repeating Key",
    scenario: "Verify Vigenère correctly repeats the key for longer plaintext",
    precondition: "Long input text with short key that needs to repeat",
    postcondition: "Text is properly encrypted with repeating key and then decrypted",
    priority: "Medium",
    comments: "Tests key repetition behavior",
    execute: () => {
      const plaintext = "THISISALONGMESSAGETOTESTTHEKEYREPETITION";
      const key = "SHORT";  // Key will repeat several times
      const encrypted = encryptVigenere(plaintext, key);
      const decrypted = decryptVigenere(encrypted, key);
      
      const passed = normalizeText(plaintext) === decrypted;
      return {
        passed,
        message: passed 
          ? `Vigenère key repetition successful: "${plaintext}" -> "${encrypted}" -> "${decrypted}"`
          : `Vigenère key repetition failed: "${plaintext}" -> "${encrypted}" -> "${decrypted}"`
      };
    }
  },
  {
    id: "TVIG-003",
    name: "Vigenère Special Character Handling",
    scenario: "Ensure Vigenère properly filters non-alphabetic characters",
    precondition: "Input text with mixed alphanumeric and special characters",
    postcondition: "Non-alphabetic characters are correctly filtered during encryption",
    priority: "Medium",
    comments: "Tests text normalization behavior",
    execute: () => {
      const plaintext = "Hello, World! 123";
      const key = "CIPHER";
      const encrypted = encryptVigenere(plaintext, key);
      const decrypted = decryptVigenere(encrypted, key);
      
      // Normalize the plaintext for comparison (uppercase, only letters)
      const normalizedPlaintext = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
      
      const passed = normalizedPlaintext === decrypted;
      return {
        passed,
        message: passed 
          ? `Vigenère special character handling successful: "${plaintext}" -> "${normalizedPlaintext}" -> "${encrypted}" -> "${decrypted}"`
          : `Vigenère special character handling failed: "${plaintext}" -> "${normalizedPlaintext}" -> "${encrypted}" -> "${decrypted}"`
      };
    }
  },
  {
    id: "TVIG-004",
    name: "Vigenère Empty Input Handling",
    scenario: "Test empty input and empty key handling",
    precondition: "Empty input string or empty key",
    postcondition: "Empty input returns empty output, empty key throws error",
    priority: "Low",
    comments: "Tests edge case handling",
    execute: () => {
      try {
        const emptyResult = encryptVigenere('', 'KEY');
        const emptyKeyTest = (() => {
          try {
            encryptVigenere('TEST', '');
            return false; // Should have thrown an error
          } catch (e) {
            return true; // Successfully caught the error
          }
        })();
        
        return {
          passed: emptyResult === '' && emptyKeyTest,
          message: emptyResult === '' && emptyKeyTest
            ? `Empty input handling successful: Empty text returns empty result and empty key throws error`
            : `Empty input handling failed: Empty text: ${emptyResult === ''}, Empty key throws error: ${emptyKeyTest}`
        };
      } catch (error) {
        return {
          passed: false,
          message: `Empty input test failed with error: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    }
  }
];

// Combined array of all tests
const allTests: TestCase[] = [...aesTests, ...autokeyTests, ...vigenereTests];

// Helper function to normalize text (for comparison purposes)
function normalizeText(text: string): string {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
}

// Function to run all tests and generate a report
export function runEncryptionTests(): { results: Array<{ testCase: TestCase, result: { passed: boolean; message: string } }>, summary: { total: number, passed: number, failed: number } } {
  const results = allTests.map(testCase => {
    const result = testCase.execute();
    return { testCase, result };
  });
  
  const total = results.length;
  const passed = results.filter(r => r.result.passed).length;
  const failed = total - passed;
  
  return {
    results,
    summary: { total, passed, failed }
  };
}

// Generate test report in CSV format (matches the requested format in the image)
export function generateTestReport(): string {
  const testResults = runEncryptionTests();
  let csvContent = "No.,TC ID,TEST SCENARIO,PRE CONDITION,POST CONDITION,PRIORITY,COMMENTS\n";
  
  testResults.results.forEach((result, index) => {
    const { testCase, result: testResult } = result;
    const status = testResult.passed ? "PASS" : "FAIL";
    const comments = testResult.passed ? testCase.comments : `${testCase.comments} - FAILED: ${testResult.message}`;
    
    csvContent += `${index + 1},${testCase.id},${testCase.scenario},${testCase.precondition},${testCase.postcondition},${testCase.priority},${comments}\n`;
  });
  
  return csvContent;
}

// Generate test report in HTML format for better visualization
export function generateHtmlReport(): string {
  const testResults = runEncryptionTests();
  const { summary } = testResults;
  
  let htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Encryption Algorithm Test Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      table { border-collapse: collapse; width: 100%; margin-top: 20px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #4CAF50; color: white; }
      tr:nth-child(even) { background-color: #f2f2f2; }
      .pass { color: green; font-weight: bold; }
      .fail { color: red; font-weight: bold; }
      .summary { margin-top: 20px; font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>Encryption Algorithm Test Report</h1>
    <div class="summary">
      <p>Total Tests: ${summary.total}</p>
      <p>Passed: <span class="pass">${summary.passed}</span></p>
      <p>Failed: <span class="fail">${summary.failed}</span></p>
    </div>
    <table>
      <tr>
        <th>No.</th>
        <th>TC ID</th>
        <th>TEST SCENARIO</th>
        <th>PRE CONDITION</th>
        <th>POST CONDITION</th>
        <th>PRIORITY</th>
        <th>STATUS</th>
        <th>COMMENTS</th>
      </tr>
  `;
  
  testResults.results.forEach((result, index) => {
    const { testCase, result: testResult } = result;
    const statusClass = testResult.passed ? "pass" : "fail";
    const status = testResult.passed ? "PASS" : "FAIL";
    const comments = testResult.passed ? testCase.comments : `${testCase.comments} - FAILED: ${testResult.message}`;
    
    htmlContent += `
      <tr>
        <td>${index + 1}</td>
        <td>${testCase.id}</td>
        <td>${testCase.scenario}</td>
        <td>${testCase.precondition}</td>
        <td>${testCase.postcondition}</td>
        <td>${testCase.priority}</td>
        <td class="${statusClass}">${status}</td>
        <td>${comments}</td>
      </tr>
    `;
  });
  
  htmlContent += `
    </table>
  </body>
  </html>
  `;
  
  return htmlContent;
}