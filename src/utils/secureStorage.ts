// Secure storage utility with encryption for sensitive data
export const secureStorage = {
  // Simple encryption for localStorage (not cryptographically secure, but better than plain text)
  setItem: (key: string, value: any) => {
    try {
      const data = JSON.stringify({
        value,
        timestamp: Date.now(),
        checksum: btoa(JSON.stringify(value) + key).slice(0, 8) // Simple integrity check
      });
      
      // Basic obfuscation (not real encryption)
      const encoded = btoa(data);
      localStorage.setItem(`sec_${key}`, encoded);
    } catch (error) {
      console.warn('Failed to store secure data:', error);
      // Fallback to regular storage
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  
  getItem: (key: string) => {
    try {
      const encoded = localStorage.getItem(`sec_${key}`);
      if (!encoded) return null;
      
      const data = JSON.parse(atob(encoded));
      
      // Verify integrity
      const expectedChecksum = btoa(JSON.stringify(data.value) + key).slice(0, 8);
      if (data.checksum !== expectedChecksum) {
        console.warn('Data integrity check failed for key:', key);
        return null;
      }
      
      // Check if data is too old (24 hours)
      if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
        secureStorage.removeItem(key);
        return null;
      }
      
      return data.value;
    } catch (error) {
      console.warn('Failed to retrieve secure data:', error);
      // Fallback to regular storage
      const fallback = localStorage.getItem(key);
      return fallback ? JSON.parse(fallback) : null;
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