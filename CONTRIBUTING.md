# Contributing to ByteSteps

Thank you for your interest in contributing to ByteSteps! This document provides guidelines for contributing to our digital skills platform for elderly users.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct:

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome people of all backgrounds and identities
- **Be collaborative**: Work together constructively
- **Be professional**: Maintain professional standards in all interactions

## How to Contribute

### Reporting Bugs

Before submitting a bug report:
1. Check existing issues to avoid duplicates
2. Use the latest version of the application
3. Provide detailed reproduction steps

When submitting a bug report, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser/device information
- Screenshots if applicable

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:
1. Check existing feature requests
2. Explain the use case and benefits
3. Consider accessibility implications
4. Provide mockups or examples if helpful

### Development Process

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Submit a pull request** with clear description

### Code Standards

- **TypeScript**: Use strict mode with proper typing
- **ESLint**: Follow the configured linting rules
- **Prettier**: Use consistent code formatting
- **Accessibility**: Ensure WCAG AA compliance
- **Testing**: Include unit tests for new features
- **Documentation**: Update docs for significant changes

### Accessibility Guidelines

Given our elderly user base, please ensure:
- Minimum 44px touch targets
- Sufficient color contrast (4.5:1 ratio)
- Keyboard navigation support
- Screen reader compatibility
- Clear, simple language

### Testing Requirements

- Unit tests for new components/functions
- Integration tests for user flows
- Accessibility testing with axe-core
- Manual testing with keyboard navigation
- Cross-browser compatibility testing

### Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Add appropriate labels
4. Request review from maintainers
5. Address feedback promptly

### Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/bytesteps.git
cd bytesteps

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test
```

## Project Structure

- `src/components/`: React components
- `src/pages/`: Application pages
- `src/hooks/`: Custom React hooks
- `src/utils/`: Utility functions
- `src/types/`: TypeScript type definitions
- `supabase/`: Database and edge functions

## Community

- Join discussions in GitHub Issues
- Follow our roadmap for upcoming features
- Participate in user testing sessions

## Recognition

Contributors will be recognized in our README and release notes. We appreciate all forms of contribution, from code to documentation to user feedback.

## Questions?

Feel free to reach out:
- Create an issue for general questions
- Email: developers@bytesteps.co.uk

Thank you for helping make digital skills accessible to everyone!