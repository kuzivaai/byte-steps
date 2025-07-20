# Security Policy

## Reporting Security Vulnerabilities

ByteSteps takes security seriously. We appreciate your efforts to responsibly disclose security vulnerabilities.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, report security issues to: **security@bytesteps.co.uk**

Include the following information:
- Type of issue (e.g., XSS, SQL injection, etc.)
- Full paths of source file(s) related to the issue
- Location of the affected source code (tag/branch/commit)
- Special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 72 hours
- **Regular Updates**: Every 5 business days
- **Resolution Target**: 90 days or less

### Security Measures

ByteSteps implements multiple layers of security:

#### Data Protection
- AES-GCM 256-bit encryption for sensitive data
- PBKDF2 key derivation with 100,000 iterations
- Secure local storage with automatic cleanup

#### API Security
- Rate limiting on all endpoints
- JWT token validation
- Input sanitization and validation
- SQL injection prevention

#### Database Security
- Row Level Security (RLS) enabled on all tables
- User data isolation
- Audit logging for sensitive operations
- Regular security patches

#### Application Security
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options protection
- XSS prevention measures

#### Privacy Protection
- GDPR compliance
- Minimal data collection
- User consent management
- Data export/deletion capabilities

### Scope

This security policy applies to:
- The main ByteSteps application
- All API endpoints
- Database interactions
- Third-party integrations

### Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | ✅ Yes             |
| < 1.0   | ❌ No              |

### Security Best Practices for Contributors

When contributing to ByteSteps:

1. **Never commit sensitive data**
   - API keys, passwords, or tokens
   - Personal information
   - Production configuration

2. **Validate all inputs**
   - Sanitize user inputs
   - Use parameterized queries
   - Implement proper error handling

3. **Follow authentication best practices**
   - Use secure session management
   - Implement proper access controls
   - Validate user permissions

4. **Keep dependencies updated**
   - Regular dependency audits
   - Security patch management
   - Monitor for vulnerabilities

### Security Contacts

- **Primary Contact**: security@bytesteps.co.uk
- **Emergency Contact**: emergency@bytesteps.co.uk

### Hall of Fame

We recognize security researchers who help improve ByteSteps security:

*Contributors will be listed here upon request and after issue resolution.*

## Legal

This security policy is subject to our Terms of Service and Privacy Policy. Responsible disclosure is appreciated and will be handled with care and confidentiality.