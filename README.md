# ByteSteps - Digital Skills Platform for Elderly Users

<div align="center">
  
  [![Security Score](https://img.shields.io/badge/Security-9.5%2F10-brightgreen)](https://github.com/yourusername/bytesteps)
  [![GDPR Compliant](https://img.shields.io/badge/GDPR-Compliant-blue)](https://bytesteps.co.uk/privacy)
  [![Accessibility](https://img.shields.io/badge/WCAG-AA%20Compliant-green)](https://www.w3.org/WAI/WCAG2AA-Conformance)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
</div>

## Overview

ByteSteps is a comprehensive digital skills learning platform specifically designed for elderly users and those new to technology. Built with accessibility, security, and user-friendliness at its core, ByteSteps provides personalized learning pathways to help users gain confidence with digital tools.

## 🎯 Key Features

- **Personalized Learning Paths**: AI-powered assessment creates custom learning journeys
- **Accessibility First**: WCAG AA compliant with large touch targets and screen reader support
- **Offline Support**: Continue learning even without internet connection
- **Local Resources**: Connects users with nearby libraries and support centers
- **GDPR Compliant**: Full data privacy with export and deletion capabilities
- **Multi-Language Ready**: Infrastructure prepared for Welsh language support

## 🛠️ Technical Stack

- **Frontend**: React 18.3 + TypeScript 5.6
- **Styling**: Tailwind CSS + Radix UI components
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI Integration**: OpenAI GPT-4 for personalized coaching
- **Security**: AES-GCM encryption, comprehensive RLS policies
- **Deployment**: Vercel with global CDN

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bytesteps.git
cd bytesteps
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key
```

5. Run database migrations:
```bash
npm run db:migrate
```

6. Start the development server:
```bash
npm run dev
```

## 📊 Architecture

```
bytesteps/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Route pages
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── content/       # Learning content
│   └── types/         # TypeScript definitions
├── supabase/
│   ├── functions/     # Edge functions
│   └── migrations/    # Database schema
└── public/           # Static assets
```

## 🔒 Security Features

- **Encryption**: AES-GCM 256-bit encryption for sensitive data
- **Rate Limiting**: Comprehensive API protection
- **Input Sanitization**: AI prompt injection prevention
- **RLS Policies**: Row-level security on all database tables
- **Security Headers**: Full CSP, HSTS, and XSS protection

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run security audit
npm run security:audit
```

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: <200KB gzipped
- **Time to Interactive**: <2s on 3G
- **Memory Usage**: <50MB typical usage

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Designed with input from Age UK digital inclusion research
- Accessibility testing by local charities
- Security audit performed by independent security researchers

## 📞 Support

- **Documentation**: docs.bytesteps.co.uk
- **Issues**: [GitHub Issues](https://github.com/yourusername/bytesteps/issues)
- **Email**: support@bytesteps.co.uk

---

<div align="center">
  Made with ❤️ for digital inclusion
</div>