export const documentation = {
  overview: `# CSMCL.Space Onboarding

A modern Vue.js application for CSMCL.Space user onboarding and identity management. This application provides a seamless experience for users to create and manage their CSMCL identity, verify their account, set up their space, and connect their wallet.

> 💡 **For Developers & Contributors**: Select "README" from the navigation menu to find development setup, contribution guidelines, and project roadmap.

## Key Features
- Secure user authentication with rate limiting
- CSMCL.Explorer mode for temporary access
- Multi-step onboarding process
- Real-time space analytics
- Wallet integration
- End-to-end encryption
- Comprehensive security measures
- Full compliance with privacy standards

## Roles and Permissions

### Admin Role
Administrators have full system access with the following permissions:
- Content editing and management
- User management capabilities
- Access to all metrics and analytics
- Full explorer features access
- Complete view access to all content
- Security audit capabilities
- System configuration control

### User Role
Standard users have basic access with these permissions:
- View access to general content
- Access to personal metrics
- Basic platform features
- Wallet integration features
- Profile management
- Cannot manage users or content
- No explorer features access

### Explorer Role
Temporary users with exploration privileges:
- Access to explorer-specific features
- View access to general content
- Access to metrics and analytics
- Time-limited account (10 days)
- Cannot manage users or edit content
- Sandboxed environment access
- Limited API permissions

## Security Highlights
- Multi-layer authentication with SHA3 hashing
- End-to-end encryption for data transmission
- Sandboxed explorer environment
- Regular security audits and compliance
- Comprehensive incident response system
- GDPR and CCPA compliance
- SOC 2 and ISO 27001 certified
- PCI DSS compliant where applicable

For detailed security information, see the Security section.`,

  security: `## Security

### Authentication System
1. **Multi-Layer Authentication**
   - Challenge-based verification
   - Session token validation
   - Rate-limited login attempts (5 per 15 minutes)
   - Secure password hashing (SHA3)
   - IP-based tracking
   - Progressive timeout increase
   - Account lockout protection
   - Automated notification system

2. **Session Management**
   - JWT token implementation
   - Regular session rotation
   - Secure cookie handling
   - XSS protection headers
   - CSRF token validation
   - Secure state management
   - Memory cleanup routines

3. **Rate Limiting**
   - 5 attempts per 15 minutes
   - Progressive timeout increase
   - IP-based rate limiting
   - Account lockout protection
   - Automated notification system

### Explorer Mode Security
1. **Isolation**
   - Sandboxed environment
   - Temporary storage only
   - No persistent data
   - Isolated network access
   - Limited API permissions
   - Memory-only operations
   - Secure state management

2. **Access Control**
   - Time-based expiration
   - Read-only external access
   - Protected internal routes
   - Restricted API endpoints
   - Monitored activity logs
   - Auto-cleanup on expiry

### Network Security
1. **API Protection**
   - SSL/TLS encryption
   - API key rotation
   - Request signing
   - Input validation
   - Output sanitization
   - Certificate pinning
   - Connection monitoring

2. **Data Protection**
   - End-to-end encryption
   - Secure key management
   - Access control lists
   - Backup encryption
   - Secure deletion
   - Data minimization
   - Purpose limitation

### Compliance & Privacy
1. **Standards**
   - GDPR compliance
   - CCPA adherence
   - ISO 27001
   - SOC 2
   - PCI DSS

2. **Privacy Measures**
   - Data minimization
   - Purpose limitation
   - User consent
   - Right to erasure
   - Privacy by design
   - Regular audits
   - User data control

### Implementation Examples
\`\`\`javascript
// Rate Limiting Implementation
const rateLimiter = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDuration: 60 * 60 * 1000, // 1 hour
  ipTracking: true
}

// Session Security
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  name: 'sessionId',
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  resave: false,
  saveUninitialized: false
}

// Security Headers
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}
\`\`\``,

  features: `## Features

### User Authentication
- Secure login system with rate limiting and challenge verification
- Session management using Pinia store
- Protected routes with navigation guards
- CSMCL.Explorer mode for temporary access

### User Types
#### Regular Users
- Full account with complete verification
- Permanent CSMCL identity
- Customizable space configuration
- Wallet integration capabilities

#### CSMCL.Explorer
- 24-hour temporary access
- Pre-configured space settings
- Instant onboarding completion
- Option to convert to full account

### User Registration
- Multi-step onboarding process:
  1. CSMCL.Identity Creation / account setup and recovery
     - Display name (minimum 2 words, 3+ letters each)
     - Custom email with @csmcl.space domain
     - Recovery phrase for account security
     - Security challenge verification
  2. KYC/Identity Verification / account verification / compliance check 
  3. Space Setup NFT / space configuration / email setup and connection in app`,

  'project-docs': `# Project Documentation

## README Overview
The project README provides comprehensive information about setup, development, and contribution guidelines. You can access it in two ways:

### 1. Via Navigation Menu
- Click "README" in the documentation navigation
- Contains full development and contribution details
- Always up-to-date with latest changes

### 2. Via Source Code
- Located at: \`/README.md\` in project root
- GitHub-compatible markdown format
- Great for offline reference

## Key Documentation Sections

### Getting Started
- Quick start guide
- Installation steps
- Basic configuration
- Development setup

### For Developers
- Tech stack details
- Project structure
- Coding conventions
- Local development

### For Contributors
- Contribution guidelines
- Pull request process
- Code review checklist
- Community standards

### For Beta Testers
- Testing guidelines
- Feedback submission
- Bug reporting
- Feature requests

## Additional Resources
- Project roadmap
- Community links
- Support channels
- License information

> 📘 **Note**: For the complete README content, select "README" from the navigation menu.`,

  api: `# API Reference

## Authentication
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh
- GET /api/auth/status

## User Management
- GET /api/users
- GET /api/users/:userId
- POST /api/users/create
- PUT /api/users/:userId

## Space Management
- GET /api/space/:spaceId
- POST /api/space/create
- PUT /api/space/update`,

  'data-structures': `# Data Structures

## User Store

### User State
\`\`\`javascript
{
  user: null,                    // Current user object
  isLoggedIn: false,            // Login status
  isAdmin: false,               // Admin role flag
  isExplorer: false,            // Explorer role flag
  isVerified: false,            // Verification status
  displayName: null,            // User's display name
  cosmicalEmail: null,          // CSMCL.space email
  explorerExpiry: null,         // Explorer mode expiry timestamp
  verificationDetails: {
    email: null,                // Verified email
    phone: null,                // Verified phone
    simNumber: null,            // Verified SIM
    status: 'pending',          // Status: pending, verified, failed
    completedSteps: []          // Completed verification steps
  },
  space: {
    theme: null,                // Space theme
    visibility: 'private'       // Space visibility
  },
  wallet: {
    connected: false,           // Wallet connection status
    address: null              // Wallet address
  }
}
\`\`\`

## Special Accounts

### Admin Account (InnerPixel)
\`\`\`javascript
{
  cosmicalName: 'INNERPIXEL',
  displayName: 'InnerPixel',
  email: 'innerpixel@csmcl.space',
  role: ROLES.ADMIN,
  spaceTheme: 'admin-dark',
  spaceTemplate: 'admin'
}
\`\`\`

### Explorer Account
\`\`\`javascript
{
  cosmicalName: 'CSMCL.Explorer',
  displayName: 'CSMCL Explorer',
  email: 'explorer@csmcl.space',
  role: ROLES.EXPLORER,
  spaceTheme: 'cosmic-explorer',
  spaceTemplate: 'explorer',
  expirationTime: 864000000    // 10 days in milliseconds
}
\`\`\`

## Space Configuration

### Theme Structure
\`\`\`javascript
{
  name: string,                 // Theme name
  colors: {
    primary: string,            // Primary color
    secondary: string,          // Secondary color
    accent: string,            // Accent color
    background: string         // Background color
  },
  fonts: {
    heading: string,           // Heading font family
    body: string              // Body font family
  }
}
\`\`\`

### Space Metrics
\`\`\`javascript
{
  network: {
    connections: number,       // Active connections
    bandwidth: number,        // Bandwidth usage
    latency: number          // Network latency
  },
  activity: {
    interactions: number,     // User interactions
    requests: number,        // API requests
    errors: number          // Error count
  },
  social: {
    engagement: number,      // Engagement score
    reach: number,          // Network reach
    influence: number       // Influence score
  }
}
\`\`\`

## Verification System

### Challenge Structure
\`\`\`javascript
{
  id: string,                 // Challenge ID
  type: string,              // Challenge type
  value: string,            // Challenge value
  expiry: number,          // Expiry timestamp
  attempts: number,        // Remaining attempts
  maxAttempts: number     // Maximum attempts allowed
}
\`\`\`

### Verification Response
\`\`\`javascript
{
  success: boolean,           // Verification success
  message: string,           // Response message
  nextStep: string,         // Next verification step
  token: string,           // Verification token
  expiry: number          // Token expiry timestamp
}
\`\`\`

## Network Management

### Connection Object
\`\`\`javascript
{
  id: string,                // Connection ID
  type: string,             // Connection type
  status: string,          // Connection status
  metadata: {
    created: number,       // Creation timestamp
    lastActive: number,   // Last activity timestamp
    protocol: string,    // Connection protocol
    version: string     // Protocol version
  }
}
\`\`\`

For more information about implementing these data structures, see the Development section.
`,

  architecture: `## Architecture

### Frontend
- Vue 3 with Composition API
- Pinia for state management
- Vue Router for navigation
- TailwindCSS for styling

### Backend
- Node.js with Express
- PostgreSQL database
- Redis for caching
- JWT authentication

### Infrastructure
- VPS deployment
- Nginx reverse proxy
- SSL/TLS encryption
- Automated backups`,

  deployment: `## Deployment Guide

### Prerequisites
- Node.js 16+
- PostgreSQL 13+
- Redis 6+
- Nginx

### VPS Setup
1. Update system packages
2. Install Node.js, PostgreSQL, Redis
3. Configure Nginx
4. Set up SSL certificates

### Application Deployment
1. Clone repository
2. Install dependencies
3. Configure environment variables
4. Build frontend
5. Start application

### Monitoring
- PM2 for process management
- Nginx logs
- Application logs
- Database monitoring`,

  development: `## Development Guide

### Setup
1. Clone repository
2. Install dependencies
3. Configure environment
4. Start development server

### Testing
- Unit tests with Jest
- E2E tests with Cypress
- API tests with Supertest

### Code Style
- ESLint configuration
- Prettier formatting
- Vue style guide
- Git commit conventions`,

  readme: `# CSMCL.Space Onboarding

Welcome to CSMCL.Space - where innovation meets community! 

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## Content Overview 

### Core Documentation
- **General Overview**: Introduction to CSMCL.Space
- **User Roles**: Admin, User, and Explorer permissions
- **Security**: Authentication and data protection
- **Features**: Detailed platform capabilities
- **Architecture**: System design and components

### Guides
- **Getting Started**: First steps for new users
- **Explorer Mode**: 10-day trial experience
- **Space Setup**: Customizing your environment
- **Achievement System**: Earning and tracking progress
- **Best Practices**: Tips for optimal usage

### API & Integration
- **API Reference**: Available endpoints and methods
- **Wallet Integration**: Connecting digital wallets
- **Data Structures**: Core data models
- **Event System**: Real-time updates and notifications

## For Developers 

### Tech Stack
- Vue 3 with Composition API
- Vite for blazing fast builds
- Pinia for state management
- TailwindCSS for styling

### Project Structure
\`\`\`
src/
├── components/    # Reusable Vue components
├── stores/       # Pinia state management
├── views/        # Page components
├── services/     # API and business logic
├── composables/  # Shared composition functions
└── docs/         # Documentation content
\`\`\`

## For Beta Testers 

### Getting Started
1. Request Explorer access through our portal
2. Use the 10-day trial to test features
3. Submit feedback via GitHub Issues
4. Join our Discord community

### Key Areas to Test
- User onboarding flow
- Space customization
- Achievement system
- Documentation clarity
- Mobile responsiveness

## For Contributors 

### Ways to Contribute
1. **Code**: Submit PRs for bug fixes or features
2. **Ideas**: Open issues for feature requests
3. **Content**: Help improve documentation
4. **Design**: Share UI/UX suggestions
5. **Testing**: Report bugs and usability issues

### Contribution Guidelines
- Follow our coding style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## Future Roadmap 

### Planned Features
- [ ] Enhanced social integration
- [ ] Advanced space analytics
- [ ] Custom achievement creation
- [ ] Community marketplace
- [ ] Mobile app companion

### Community Suggestions
We welcome ideas for:
- New achievement types
- Space customization options
- Social features
- Integration possibilities
- Educational content

## Get Involved 

### Community
- Join our [Discord](https://discord.gg/csmclspace)
- Visit our [GitHub](https://github.com/csmclspace)
- Read our [Blog](https://blog.csmcl.space)
- Email: support@csmcl.space

### Ways to Contribute
1. **Code**: Submit PRs for bug fixes or features
2. **Documentation**: Help improve our docs
3. **Testing**: Report bugs and provide feedback
4. **Design**: Suggest UI/UX improvements
5. **Community**: Help other users and share knowledge

### Contribution Guidelines
- Fork the repository
- Create feature branch
- Follow code style guide
- Add tests for new features
- Update documentation
- Submit PR with clear description

## License
MIT License - feel free to use and modify as needed!

---`,
}
