# Security Policy

## Reporting Security Vulnerabilities

Please report security vulnerabilities to: **security@bytesteps.co.uk**

**Do NOT report security issues through public GitHub issues.**

## Security Status

ByteSteps maintains enterprise-grade security:
- ✅ All API keys server-side only
- ✅ RLS enabled on all database tables  
- ✅ Rate limiting on all endpoints
- ✅ GDPR compliant with encryption
- ✅ Regular security audits

For verification queries, see [Security Status](../docs/SECURITY_STATUS.md).

## Known False Positives

The Supabase Database Linter may incorrectly report SECURITY DEFINER warnings. These have been verified as false positives. See [Known Issues](../docs/KNOWN_ISSUES.md).

## Response Timeline

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 72 hours  
- **Regular Updates**: Every 5 business days
- **Resolution Target**: 90 days or less

## Security Measures

### Data Protection
- AES-GCM 256-bit encryption for sensitive data
- PBKDF2 key derivation with 100,000 iterations
- Secure local storage with automatic cleanup

### API Security  
- Rate limiting on all endpoints
- JWT token validation
- Input sanitization and validation
- SQL injection prevention

### Database Security
- Row Level Security (RLS) enabled on all tables
- User data isolation
- Audit logging for sensitive operations
- Regular security patches

### Application Security
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options protection
- XSS prevention measures

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | ✅ Yes             |
| < 1.0   | ❌ No              |

## Legal

This security policy is subject to our Terms of Service and Privacy Policy. Responsible disclosure is appreciated and will be handled with care and confidentiality.