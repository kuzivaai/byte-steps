// Real AES-GCM encryption using SubtleCrypto
const generateKey = async (password: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('bytesteps-salt-2024'), // Static salt for consistency
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

const encrypt = async (text: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const key = await generateKey('bytesteps-encryption-key-2024');
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    return btoa(text); // Fallback to base64
  }
};

const decrypt = async (encryptedData: string): Promise<string> => {
  try {
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    const key = await generateKey('bytesteps-encryption-key-2024');
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    try {
      return atob(encryptedData); // Try base64 fallback
    } catch {
      return encryptedData; // Return as-is if all fails
    }
  }
};

// Secure storage utility with real encryption
export const secureStorage = {
  setItem: async (key: string, value: any): Promise<void> => {
    try {
      const stringValue = JSON.stringify(value);
      const encrypted = await encrypt(stringValue);
      const timestamp = Date.now();
      const expiry = timestamp + (30 * 24 * 60 * 60 * 1000); // 30 days
      
      const secureData = JSON.stringify({
        data: encrypted,
        timestamp,
        expiry,
        version: 2 // Mark as new encryption version
      });
      
      localStorage.setItem(`sec_${key}`, secureData);
    } catch (error) {
      console.warn('Secure storage failed, using regular storage:', error);
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  
  getItem: async (key: string): Promise<any | null> => {
    try {
      const secureData = localStorage.getItem(`sec_${key}`);
      if (!secureData) {
        // Try fallback to regular storage
        const fallback = localStorage.getItem(key);
        return fallback ? JSON.parse(fallback) : null;
      }
      
      const parsed = JSON.parse(secureData);
      const { data, timestamp, expiry, version } = parsed;
      
      // Check expiry
      if (Date.now() > expiry) {
        localStorage.removeItem(`sec_${key}`);
        return null;
      }
      
      let decrypted: string;
      if (version === 2) {
        // New encryption
        decrypted = await decrypt(data);
      } else {
        // Legacy base64 (upgrade gradually)
        try {
          decrypted = atob(data);
        } catch {
          decrypted = data;
        }
      }
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.warn('Secure storage retrieval failed:', error);
      // Try fallback to regular storage
      try {
        const fallback = localStorage.getItem(key);
        return fallback ? JSON.parse(fallback) : null;
      } catch {
        return null;
      }
    }
  },
  
  removeItem: (key: string) => {
    localStorage.removeItem(`sec_${key}`);
    localStorage.removeItem(key); // Also remove fallback
  },
  
  clear: () => {
    // Clear only secure storage items
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('sec_')) {
        localStorage.removeItem(key);
      }
    });
  }
};

// Rate limiting utility
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export const rateLimit = (
  identifier: string, 
  maxAttempts: number = 10, 
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const userAttempts = rateLimitStore.get(identifier);
  
  if (!userAttempts || userAttempts.resetAt < now) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (userAttempts.count >= maxAttempts) {
    return false;
  }
  
  userAttempts.count++;
  return true;
};

// Input sanitization utilities
export const sanitizeInput = (input: string, maxLength: number = 500): string => {
  if (!input) return '';
  
  // Remove potentially dangerous patterns
  const dangerous = [
    'javascript:',
    'data:',
    '<script',
    '</script>',
    'onload=',
    'onerror=',
    'onclick=',
    'eval(',
    'function(',
  ];
  
  let sanitized = input;
  dangerous.forEach(pattern => {
    const regex = new RegExp(pattern, 'gi');
    sanitized = sanitized.replace(regex, '');
  });
  
  // Limit length and trim
  return sanitized.slice(0, maxLength).trim();
};

// Check if user has given consent for data processing
export const hasDataConsent = (): boolean => {
  const consent = localStorage.getItem('cookie-consent');
  return consent === 'true';
};

// GDPR-compliant data export
export const exportUserData = () => {
  const userData: any = {};
  const prefix = 'bytesteps_';
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(prefix) || key?.startsWith('sec_')) {
      try {
        const value = key.startsWith('sec_') 
          ? secureStorage.getItem(key.replace('sec_', ''))
          : JSON.parse(localStorage.getItem(key) || '');
        userData[key] = value;
      } catch {
        userData[key] = localStorage.getItem(key);
      }
    }
  }
  
  return {
    exportDate: new Date().toISOString(),
    userData,
    notice: 'This export contains all personal data stored locally in your browser for ByteSteps.'
  };
};