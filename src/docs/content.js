export const documentation = {
  overview: `# CSMCL.Space Onboarding

A modern Vue.js application for CSMCL.Space user onboarding and identity management. This application provides a seamless experience for users to create and manage their CSMCL identity, verify their account, set up their space, and connect their wallet.

## Key Features
- Secure user authentication with rate limiting
- CSMCL.Explorer mode for temporary access
- Multi-step onboarding process
- Real-time space analytics
- Wallet integration

## Security Highlights
- Multi-layer authentication with SHA3 hashing
- End-to-end encryption for data transmission
- Sandboxed explorer environment
- Regular security audits and compliance
- Comprehensive incident response system

For detailed security information, see the Security section.

## Registration Process

### Step 1: Initial Setup
1. Choose a display name:
   - Must contain at least 2 words
   - Each word must be 3+ letters
   - Only alphabetic characters allowed
   - Example: "John Smith" or "Maria Rodriguez"

2. Create your @csmcl.space email:
   - Format: firstname.lastname@csmcl.space
   - Only lowercase letters, numbers, and dots allowed
   - Must be unique in the system
   - Example: "john.smith@csmcl.space"

### Step 2: Verification Process (5 Attempts)

If you see "Registration failed. X attempts remaining", follow these steps:

1. **Check Your Input Data**:
   - Display name: Must be two or more words (e.g., "John Smith")
   - Email: Must end with @csmcl.space
   - Verification email: Must be a valid email you can access
   - SIM number: Must be your active SIM number

2. **Common Issues and Solutions**:
   - Display name too short: Ensure each word has 3+ letters
   - Invalid email format: Use only lowercase letters, numbers, and dots
   - SIM number format: Enter full number without spaces
   - Already registered email: Try a different variation

3. **Verification Steps**:
   a. Enter your details carefully
   b. Double-check all fields before submitting
   c. Click "Verify" button
   d. Wait for the verification process to complete
   e. If successful, you'll proceed to space setup
   f. If failed, review and correct your information

4. **If Attempts Running Low**:
   - Take time to review all information
   - Check for typos and formatting
   - Ensure all fields match requirements
   - Wait a few minutes before next attempt

5. **After 5 Failed Attempts**:
   - 15-minute cooldown period begins
   - Use this time to gather correct information
   - Contact support if you need assistance
   - After cooldown, you'll get 5 new attempts

### Step 3: After Successful Verification

1. Space Setup:
   - Your unique space ID will be generated
   - Configure your space settings
   - Set up security preferences
   - Choose space template

2. Final Steps:
   - Complete your profile
   - Set communication preferences
   - Configure privacy settings
   - Connect your wallet

### Need Help?

If you're having trouble with verification:
1. Email: support@csmcl.space
2. Documentation: docs.csmcl.space/help
3. Community: community.csmcl.space

Remember: Take your time and ensure all information is correct before each verification attempt. It's better to double-check than to use up attempts with incorrect data.`,

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

  security: `## Security

### Authentication System
1. **Multi-Layer Authentication**
   - Challenge-based verification
   - Session token validation
   - Rate-limited login attempts (5 per 15 minutes)
   - Secure password hashing (SHA3)
   - IP-based tracking

2. **Session Management**
   - JWT token implementation
   - Regular session rotation
   - Secure cookie handling
   - XSS protection headers
   - CSRF token validation

### Explorer Mode Security
1. **Isolation**
   - Sandboxed environment
   - Temporary storage only
   - No persistent data
   - Isolated network access
   - Limited API permissions

2. **Access Control**
   - Time-based expiration (24 hours)
   - Read-only external access
   - Protected internal routes
   - Restricted API endpoints
   - Monitored activity logs

### Identity Protection
1. **CSMCL.ID Security**
   - Unique identifier generation
   - Cryptographic binding
   - Recovery system
   - Anti-spoofing measures
   - Identity verification

2. **Profile Security**
   - Encrypted user data
   - Secure storage
   - Access logging
   - Change tracking
   - Audit trail

### Network Security
1. **API Protection**
   - SSL/TLS encryption
   - API key rotation
   - Request signing
   - Input validation
   - Output sanitization

2. **Connection Security**
   - Secure WebSocket
   - TLS 1.3 required
   - Certificate pinning
   - Connection monitoring
   - Traffic analysis

### Data Security
1. **Storage**
   - Encrypted at rest
   - Secure key management
   - Access control lists
   - Backup encryption
   - Secure deletion

2. **Transmission**
   - End-to-end encryption
   - Secure protocols
   - Data integrity checks
   - Transport security
   - Channel encryption

### Compliance
1. **Standards**
   - GDPR compliance
   - CCPA adherence
   - ISO 27001
   - SOC 2
   - PCI DSS

2. **Privacy**
   - Data minimization
   - Purpose limitation
   - User consent
   - Right to erasure
   - Privacy by design

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
\`\`\`

### Security Best Practices
1. **Development**
   - Secure coding guidelines
   - Regular security training
   - Code review process
   - Security testing
   - Dependency scanning

2. **Maintenance**
   - Regular updates
   - Security patching
   - Performance monitoring
   - System hardening
   - Configuration review`,

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

  api: `## API Reference

### Authentication Endpoints
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/verify
- POST /api/auth/challenge

### User Management
- GET /api/user/profile
- PUT /api/user/profile
- POST /api/user/verify

### Space Management
- GET /api/space/:spaceId
- POST /api/space/create
- PUT /api/space/update`
}
