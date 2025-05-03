/**
 * Formats text to hexadecimal representation
 * @param text Text to convert to hex
 * @returns Hexadecimal string
 */
export function formatToHex(text: string): string {
  return Array.from(text)
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Formats hexadecimal to text
 * @param hex Hexadecimal string
 * @returns Converted text
 */
export function formatFromHex(hex: string): string {
  if (hex.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substring(i, i + 2), 16));
  }
  
  return bytes.map(byte => String.fromCharCode(byte)).join('');
}

/**
 * Formats text for display by adding ellipsis for long text
 * @param text Text to format
 * @param maxLength Maximum length before truncation
 * @returns Formatted text
 */
export function formatForDisplay(text: string, maxLength: number = 100): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Checks if a string is valid hexadecimal
 * @param str String to check
 * @returns Boolean indicating if valid hex
 */
export function isValidHex(str: string): boolean {
  return /^[0-9A-Fa-f]*$/.test(str);
}