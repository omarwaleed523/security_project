// Vigenère Cipher Implementation from scratch

// Utility function to normalize text (uppercase and remove non-alphabetic characters)
function normalizeText(text: string): string {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
}

// Utility function to convert letter to number (A=0, B=1, etc.)
function letterToNumber(letter: string): number {
  return letter.charCodeAt(0) - 65; // 'A' is 65 in ASCII
}

// Utility function to convert number to letter (0=A, 1=B, etc.)
function numberToLetter(num: number): string {
  return String.fromCharCode((num % 26) + 65);
}

/**
 * Encrypts a message using the Vigenère cipher
 * @param plaintext The text to encrypt
 * @param key The encryption key
 * @returns The encrypted text
 */
export function encryptVigenere(plaintext: string, key: string): string {
  // Normalize inputs
  const normalizedPlaintext = normalizeText(plaintext);
  if (normalizedPlaintext.length === 0) {
    return '';
  }
  
  const normalizedKey = normalizeText(key);
  if (normalizedKey.length === 0) {
    throw new Error('Vigenère encryption key must contain at least one letter');
  }

  let result = '';
  
  // Encrypt each character
  for (let i = 0; i < normalizedPlaintext.length; i++) {
    const p = letterToNumber(normalizedPlaintext[i]);
    const k = letterToNumber(normalizedKey[i % normalizedKey.length]);
    
    // Add and take modulo 26
    const c = (p + k) % 26;
    
    result += numberToLetter(c);
  }
  
  return result;
}

/**
 * Decrypts a message using the Vigenère cipher
 * @param ciphertext The text to decrypt
 * @param key The decryption key
 * @returns The decrypted text
 */
export function decryptVigenere(ciphertext: string, key: string): string {
  // Normalize inputs
  const normalizedCiphertext = normalizeText(ciphertext);
  if (normalizedCiphertext.length === 0) {
    return '';
  }
  
  const normalizedKey = normalizeText(key);
  if (normalizedKey.length === 0) {
    throw new Error('Vigenère decryption key must contain at least one letter');
  }
  
  let result = '';
  
  // Decrypt each character
  for (let i = 0; i < normalizedCiphertext.length; i++) {
    const c = letterToNumber(normalizedCiphertext[i]);
    const k = letterToNumber(normalizedKey[i % normalizedKey.length]);
    
    // Subtract and handle negative values with modulo 26
    const p = (c - k + 26) % 26;
    
    result += numberToLetter(p);
  }
  
  return result;
}