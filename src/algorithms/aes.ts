// AES algorithm implementation from scratch
// Note: This is a simplified implementation for educational purposes

// S-box for SubBytes operation
const sBox = [
  [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76],
  [0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0],
  [0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15],
  [0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75],
  [0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84],
  [0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf],
  [0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8],
  [0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2],
  [0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73],
  [0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb],
  [0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79],
  [0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08],
  [0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a],
  [0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e],
  [0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf],
  [0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16]
];

// Inverse S-box for InvSubBytes operation
const invSBox = [
  [0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb],
  [0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb],
  [0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e],
  [0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25],
  [0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92],
  [0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84],
  [0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06],
  [0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b],
  [0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73],
  [0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e],
  [0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b],
  [0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4],
  [0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f],
  [0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef],
  [0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61],
  [0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d]
];

// Rcon lookup table
const Rcon = [
  0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36
];

// Convert string to byte array
function stringToBytes(str: string): number[] {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}

// Convert byte array to string
function bytesToString(bytes: number[]): string {
  return bytes.map(byte => String.fromCharCode(byte)).join('');
}

// Convert hex string to byte array
function hexToBytes(hex: string): number[] {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return bytes;
}

// Convert byte array to hex string
function bytesToHex(bytes: number[]): string {
  return bytes.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Key expansion
function keyExpansion(key: number[]): number[][] {
  const Nb = 4; // Number of columns in the state
  const Nk = 4; // Number of 32-bit words in the key
  const Nr = 10; // Number of rounds
  
  const w = new Array(Nb * (Nr + 1));
  
  let temp: number[];
  
  // First round key is the key itself
  for (let i = 0; i < Nk; i++) {
    w[i] = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
  }
  
  // Generate round keys
  for (let i = Nk; i < Nb * (Nr + 1); i++) {
    temp = [...w[i - 1]];
    
    if (i % Nk === 0) {
      // RotWord
      const t = temp[0];
      temp[0] = temp[1];
      temp[1] = temp[2];
      temp[2] = temp[3];
      temp[3] = t;
      
      // SubWord
      for (let j = 0; j < 4; j++) {
        const row = (temp[j] >> 4) & 0xF;
        const col = temp[j] & 0xF;
        temp[j] = sBox[row][col];
      }
      
      // XOR with Rcon
      temp[0] ^= Rcon[i / Nk];
    }
    
    w[i] = new Array(4);
    for (let j = 0; j < 4; j++) {
      w[i][j] = w[i - Nk][j] ^ temp[j];
    }
  }
  
  return w;
}

// SubBytes transformation
function subBytes(state: number[][]): void {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const row = (state[i][j] >> 4) & 0xF;
      const col = state[i][j] & 0xF;
      state[i][j] = sBox[row][col];
    }
  }
}

// InvSubBytes transformation
function invSubBytes(state: number[][]): void {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const row = (state[i][j] >> 4) & 0xF;
      const col = state[i][j] & 0xF;
      state[i][j] = invSBox[row][col];
    }
  }
}

// ShiftRows transformation
function shiftRows(state: number[][]): void {
  // Row 1: shift left by 1
  const temp1 = state[1][0];
  state[1][0] = state[1][1];
  state[1][1] = state[1][2];
  state[1][2] = state[1][3];
  state[1][3] = temp1;
  
  // Row 2: shift left by 2
  const temp2 = state[2][0];
  const temp3 = state[2][1];
  state[2][0] = state[2][2];
  state[2][1] = state[2][3];
  state[2][2] = temp2;
  state[2][3] = temp3;
  
  // Row 3: shift left by 3
  const temp4 = state[3][0];
  state[3][0] = state[3][3];
  state[3][3] = state[3][2];
  state[3][2] = state[3][1];
  state[3][1] = temp4;
}

// InvShiftRows transformation
function invShiftRows(state: number[][]): void {
  // Row 1: shift right by 1
  const temp1 = state[1][3];
  state[1][3] = state[1][2];
  state[1][2] = state[1][1];
  state[1][1] = state[1][0];
  state[1][0] = temp1;
  
  // Row 2: shift right by 2
  const temp2 = state[2][0];
  const temp3 = state[2][1];
  state[2][0] = state[2][2];
  state[2][1] = state[2][3];
  state[2][2] = temp2;
  state[2][3] = temp3;
  
  // Row 3: shift right by 3 (which is equivalent to left shift by 1)
  const temp4 = state[3][0];
  state[3][0] = state[3][1];
  state[3][1] = state[3][2];
  state[3][2] = state[3][3];
  state[3][3] = temp4;
}

// GF(2^8) multiplication
function gmul(a: number, b: number): number {
  let p = 0;
  let hiBitSet;
  
  for (let i = 0; i < 8; i++) {
    if ((b & 1) !== 0) {
      p ^= a;
    }
    
    hiBitSet = (a & 0x80) !== 0;
    a <<= 1;
    
    if (hiBitSet) {
      a ^= 0x1b;
    }
    
    b >>= 1;
  }
  
  return p & 0xFF;
}

// MixColumns transformation
function mixColumns(state: number[][]): void {
  const temp = new Array(4);
  
  for (let c = 0; c < 4; c++) {
    temp[0] = state[0][c];
    temp[1] = state[1][c];
    temp[2] = state[2][c];
    temp[3] = state[3][c];
    
    state[0][c] = gmul(0x02, temp[0]) ^ gmul(0x03, temp[1]) ^ temp[2] ^ temp[3];
    state[1][c] = temp[0] ^ gmul(0x02, temp[1]) ^ gmul(0x03, temp[2]) ^ temp[3];
    state[2][c] = temp[0] ^ temp[1] ^ gmul(0x02, temp[2]) ^ gmul(0x03, temp[3]);
    state[3][c] = gmul(0x03, temp[0]) ^ temp[1] ^ temp[2] ^ gmul(0x02, temp[3]);
  }
}

// InvMixColumns transformation
function invMixColumns(state: number[][]): void {
  const temp = new Array(4);
  
  for (let c = 0; c < 4; c++) {
    temp[0] = state[0][c];
    temp[1] = state[1][c];
    temp[2] = state[2][c];
    temp[3] = state[3][c];
    
    state[0][c] = gmul(0x0e, temp[0]) ^ gmul(0x0b, temp[1]) ^ gmul(0x0d, temp[2]) ^ gmul(0x09, temp[3]);
    state[1][c] = gmul(0x09, temp[0]) ^ gmul(0x0e, temp[1]) ^ gmul(0x0b, temp[2]) ^ gmul(0x0d, temp[3]);
    state[2][c] = gmul(0x0d, temp[0]) ^ gmul(0x09, temp[1]) ^ gmul(0x0e, temp[2]) ^ gmul(0x0b, temp[3]);
    state[3][c] = gmul(0x0b, temp[0]) ^ gmul(0x0d, temp[1]) ^ gmul(0x09, temp[2]) ^ gmul(0x0e, temp[3]);
  }
}

// AddRoundKey transformation
function addRoundKey(state: number[][], roundKey: number[][]): void {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] ^= roundKey[j][i];
    }
  }
}

// Create state array from input bytes
function createState(input: number[]): number[][] {
  const state = Array(4).fill(0).map(() => Array(4).fill(0));
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[j][i] = input[i * 4 + j] || 0;
    }
  }
  
  return state;
}

// Extract bytes from state array
function extractBytes(state: number[][]): number[] {
  const output = [];
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      output.push(state[j][i]);
    }
  }
  
  return output;
}

// Process key (text or hex) and ensure it's 16 bytes
function processKey(key: string, format: string = 'text'): number[] {
  let keyBytes: number[];
  
  if (format === 'hex') {
    keyBytes = hexToBytes(key);
  } else {
    keyBytes = stringToBytes(key);
  }
  
  // Ensure key is exactly 16 bytes
  if (keyBytes.length < 16) {
    keyBytes = [...keyBytes, ...new Array(16 - keyBytes.length).fill(0)];
  } else if (keyBytes.length > 16) {
    keyBytes = keyBytes.slice(0, 16);
  }
  
  return keyBytes;
}

// Main AES encryption function
export function encryptAES(plaintext: string, key: string, format: string = 'text'): string {
  try {
    const keyBytes = processKey(key, format);
    const expandedKey = keyExpansion(keyBytes);
    const plaintextBytes = stringToBytes(plaintext);
    
    // Pad input to 16 bytes if necessary
    const paddedInput = [...plaintextBytes];
    const padLength = 16 - (paddedInput.length % 16);
    for (let i = 0; i < padLength; i++) {
      paddedInput.push(padLength);
    }
    
    const state = createState(paddedInput);
    
    // Initial round
    addRoundKey(state, expandedKey.slice(0, 4));
    
    // Main rounds
    for (let round = 1; round < 10; round++) {
      subBytes(state);
      shiftRows(state);
      mixColumns(state);
      addRoundKey(state, expandedKey.slice(round * 4, (round + 1) * 4));
    }
    
    // Final round
    subBytes(state);
    shiftRows(state);
    addRoundKey(state, expandedKey.slice(40, 44));
    
    const cipherBytes = extractBytes(state);
    return bytesToHex(cipherBytes);
  } catch (e) {
    throw new Error(`AES Encryption error: ${e instanceof Error ? e.message : String(e)}`);
  }
}

// Main AES decryption function
export function decryptAES(ciphertext: string, key: string, format: string = 'text'): string {
  try {
    console.log("Decryption input:", ciphertext);
    console.log("Is valid hex?", /^[0-9A-Fa-f]*$/.test(ciphertext));
    
    const keyBytes = processKey(key, format);
    const expandedKey = keyExpansion(keyBytes);
    
    // Make sure ciphertext is in hexadecimal format
    if (!/^[0-9A-Fa-f]*$/.test(ciphertext)) {
      throw new Error('AES Decryption requires hexadecimal input');
    }
    
    const cipherBytes = hexToBytes(ciphertext);
    
    if (cipherBytes.length % 16 !== 0) {
      throw new Error('Invalid ciphertext length');
    }
    
    const state = createState(cipherBytes);
    
    // Initial round
    addRoundKey(state, expandedKey.slice(40, 44));
    invShiftRows(state);
    invSubBytes(state);
    
    // Main rounds
    for (let round = 9; round > 0; round--) {
      addRoundKey(state, expandedKey.slice(round * 4, (round + 1) * 4));
      invMixColumns(state);
      invShiftRows(state);
      invSubBytes(state);
    }
    
    // Final round
    addRoundKey(state, expandedKey.slice(0, 4));
    
    const decryptedBytes = extractBytes(state);
    
    // Remove padding
    const padLength = decryptedBytes[decryptedBytes.length - 1];
    if (padLength > 0 && padLength <= 16) {
      const unpaddedBytes = decryptedBytes.slice(0, -padLength);
      return bytesToString(unpaddedBytes);
    } else {
      // In case the padding is invalid, return the full result
      return bytesToString(decryptedBytes);
    }
  } catch (e) {
    console.error("AES Decryption error details:", e);
    throw new Error(`AES Decryption error: ${e instanceof Error ? e.message : String(e)}`);
  }
}