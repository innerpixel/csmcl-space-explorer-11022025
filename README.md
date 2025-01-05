# CSMCL.Space Onboarding

A modern Vue.js application for CSMCL.Space user onboarding and identity management. This application provides a seamless experience for users to create and manage their CSMCL identity, verify their account, set up their space, and connect their wallet. 

>> HAVELY UNDER DEVELOPMENT PLS. KEEP IN MIND CAN CHANG ANY MINUTE!! 

## Security

### Authentication System
1. **Multi-Layer Authentication**
   - Challenge-based verification
   - Session token validation
   - Rate-limited login attempts
   - Secure password hashing (SHA3)
   - IP-based tracking

2. **Session Management**
   - JWT token implementation
   - Regular session rotation
   - Secure cookie handling
   - XSS protection headers
   - CSRF token validation

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

2. **Access Control**
   - Time-based expiration
   - Read-only external access
   - Protected internal routes
   - Restricted API endpoints
   - Monitored activity logs

3. **Data Protection**
   - No sensitive data storage
   - Encrypted temporary data
   - Auto-cleanup on expiry
   - Memory-only operations
   - Secure state management

### Identity Protection
1. **CSMCL.ID Security**
   - Unique identifier generation
   - Cryptographic binding
   - Recovery system
   - Anti-spoofing measures
   - Identity verification

2. **Verification Process**
   - Multi-factor authentication
   - Email verification
   - Phone verification
   - Challenge questions
   - Recovery options

3. **Profile Security**
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

3. **Request Validation**
   - Schema validation
   - Type checking
   - Size limits
   - Content validation
   - Security headers

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

3. **Processing**
   - Secure memory handling
   - Input sanitization
   - Output encoding
   - Secure computation
   - Memory cleanup

### Compliance
1. **Standards**
   - GDPR compliance
   - CCPA adherence
   - ISO 27001
   - SOC 2
   - PCI DSS

2. **Audit**
   - Regular security audits
   - Penetration testing
   - Vulnerability scanning
   - Code review
   - Compliance checking

3. **Privacy**
   - Data minimization
   - Purpose limitation
   - User consent
   - Right to erasure
   - Privacy by design

### Incident Response
1. **Detection**
   - Real-time monitoring
   - Anomaly detection
   - Alert system
   - Log analysis
   - Threat intelligence

2. **Response**
   - Incident playbooks
   - Automated responses
   - Manual intervention
   - User notification
   - Recovery procedures

3. **Recovery**
   - Backup restoration
   - Service continuity
   - Data recovery
   - System hardening
   - Post-mortem analysis

### Implementation Examples

```javascript
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
```

### Security Best Practices
1. **Development**
   - Secure coding guidelines
   - Regular security training
   - Code review process
   - Security testing
   - Dependency scanning

2. **Deployment**
   - Secure configuration
   - Environment isolation
   - Access control
   - Monitoring setup
   - Backup procedures

3. **Maintenance**
   - Regular updates
   - Security patching
   - Performance monitoring
   - System hardening
   - Configuration review

4. **User Education**
   - Security guidelines
   - Best practices
   - Feature documentation
   - Support resources
   - Security awareness

## User Types and Roles

CSMCL.Space supports three distinct user types, each with specific permissions and capabilities:

### 1. Regular Users
- **Role**: `USER`
- **Description**: Standard users with full access to personal space management
- **Permissions**:
  - View personal metrics and analytics
  - Manage personal space and profile
  - Access standard features
  - Complete full onboarding process
- **Account Type**: Permanent
- **Features**:
  - Full identity management
  - Space customization
  - Network interactions
  - Transaction capabilities
  - Social engagement

### 2. Explorer Users
- **Role**: `EXPLORER`
- **Description**: Temporary users with limited access for platform exploration
- **Permissions**:
  - View metrics
  - Limited space management
  - Basic feature access
- **Account Type**: Temporary (10-day expiration)
- **Special Characteristics**:
  - Uses cosmic-explorer theme
  - Temporary space allocation
  - Limited feature set
  - Session expiry tracking
  - No permanent data storage
- **Default Configuration**:
  - Username: CSMCL.Explorer
  - Theme: cosmic-explorer
  - Template: explorer

### 3. Admin Users
- **Role**: `ADMIN`
- **Description**: System administrators with full platform access
- **Permissions**:
  - Manage users
  - Manage spaces
  - Access admin panel
  - Modify system settings
  - View all metrics
  - Manage compliance
  - Override settings
  - Access audit logs
- **Account Type**: Permanent
- **Special Access**:
  - System configuration
  - User management
  - Security controls
  - Analytics dashboard
  - Compliance tools
- **Default Admin Account**:
  - Username: INNERPIXEL
  - Display Name: InnerPixel
  - Email: innerpixel@csmcl.space
  - Theme: admin-dark
  - Template: admin

### Role Implementation

```javascript
// Role-based permissions structure
const PERMISSIONS = {
  USER: {
    canViewMetrics: true,
    canManagePersonalSpace: true,
    canAccessStandardFeatures: true
  },
  EXPLORER: {
    canViewMetrics: true,
    canAccessBasicFeatures: true,
    isTemporary: true,
    expirationDays: 10
  },
  ADMIN: {
    canManageUsers: true,
    canManageSpaces: true,
    canAccessAdmin: true,
    canModifySystem: true,
    canViewMetrics: true,
    canManageCompliance: true,
    canOverrideSettings: true,
    canAccessAuditLogs: true
  }
}
```

### User Type Transitions

1. **Explorer to Regular User**:
   - Complete identity verification
   - Set up permanent credentials
   - Transfer relevant data
   - Gain full feature access

2. **Regular User to Admin**:
   - Requires system administrator approval
   - Additional security verification
   - Role permission upgrade
   - Admin training completion

3. **Permission Inheritance**:
   - Admins inherit all regular user permissions
   - Regular users inherit all explorer permissions
   - Each role adds specific capabilities

### Security Considerations

1. **Role-Based Access Control**:
   - Strict permission enforcement
   - Regular permission audits
   - Least privilege principle
   - Dynamic permission validation

2. **Session Management**:
   - Role-specific session handling
   - Automatic explorer expiration
   - Secure role transitions
   - Session integrity checks

3. **Audit Trail**:
   - Role change logging
   - Permission modification tracking
   - Access attempt recording
   - Security event monitoring

## Features

### User Authentication
- Secure login system with rate limiting and challenge verification
- Session management using Pinia store
- Protected routes with navigation guards
- CSMCL.Explorer mode for instant access and exploration

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

### Onboarding Process
Progress tracking for four main sections:

1. **Identity Verification (100%)**
   - Email setup (50%)
   - Phone number (25%)
   - Email verification (15%)
   - Phone verification (10%)

2. **Space Configuration (100%)**
   - Theme selection (25%)
   - Visibility settings (25%)
   - Accessibility configuration (25%)
   - Boundaries setup (25%)

3. **CSMCL.ID Creation (100%)**
   - Cosmical Name (25%)
   - Cosmical Email (25%)
   - Recovery Phrase (25%)
   - Space Binding (15%)
   - Confirmation (10%)

4. **Wallet Integration (100%)**
   - Connection status (50%)
   - Address verification (30%)
   - Assets loaded (20%)

### Space Analytics
Real-time metrics tracking for:

- **Space Activity**
  - Interactions count
  - Chatter traffic per hour

- **Network**
  - Active connections
  - Pending requests

- **Transactions**
  - Sent transactions
  - Received transactions

- **Community Engagement**
  - Content interactions
  - Collaboration score
  - Community contributions

- **Requests**
  - Sent requests
  - Received requests

- **Traffic**
  - Inbound traffic per hour
  - Outbound traffic per hour

### Navigation
- Responsive navigation bar with:
  - Dynamic route highlighting
  - User menu for logged-in users
  - Conditional "Get Started" button
  - Documentation access

### CSMCL.Explorer Mode

### Overview
CSMCL.Explorer is a temporary account type that allows users to experience CSMCL.Space without immediate commitment to full registration. It provides a pre-configured environment with sample data and full feature access for 24 hours.

### Features
- **Instant Access**
  - No email verification required
  - Pre-configured space settings
  - Sample data populated automatically
  - All features unlocked immediately

- **Time-Limited**
  - 24-hour access period
  - Visible countdown timer
  - Graceful session expiration
  - Option to extend by converting to full account

- **Pre-configured Settings**
  - Theme: cosmic-explorer
  - Visibility: private
  - Space size: small
  - Default boundaries set

- **Sample Analytics**
  - Populated activity metrics
  - Simulated network connections
  - Example transactions
  - Demonstration of social features

### Explorer Identity
- **Temporary CSMCL.ID**
  - Format: CSMCL.Explorer
  - Email: explorer@csmcl.space
  - Auto-generated space binding
  - No recovery phrase needed

### Space Configuration
- **Pre-set Environment**
  - Cosmic explorer theme
  - Private visibility mode
  - Limited expandability
  - Basic template applied

### Conversion Process
1. **To Full Account**
   - Retain space configuration
   - Complete identity verification
   - Set up permanent CSMCL.ID
   - Connect wallet if desired

2. **Data Handling**
   - Option to preserve settings
   - Analytics reset for fresh start
   - Space binding regeneration
   - New permanent credentials

### Security Considerations
- **Session Management**
  - Automatic cleanup after expiration
  - No sensitive data storage
  - Limited network permissions
  - Isolated space environment

- **Access Control**
  - Read-only external interactions
  - No permanent changes to ecosystem
  - Protected internal boundaries
  - Safe exploration environment

### Technical Implementation
- **State Management**
  ```javascript
  // Explorer user constants
  const EXPLORER_USER = {
    cosmicalName: 'CSMCL.Explorer',
    displayName: 'CSMCL Explorer',
    email: 'explorer@csmcl.space',
    spaceTheme: 'cosmic-explorer',
    spaceTemplate: 'explorer',
    expirationTime: 24 * 60 * 60 * 1000 // 24 hours
  }
  ```

- **Sample Metrics**
  ```javascript
  // Initial explorer metrics
  {
    activity: { interactions: 12, chatter: 5 },
    network: { connections: 3, pending: 2 },
    transactions: { sent: 8, received: 15 },
    social: { shares: 4, engagement: 75 },
    requests: { sent: 2, received: 1 },
    traffic: { inbound: 25, outbound: 18 }
  }
  ```

### User Interface
- **Explorer Badge**
  - Visible indicator of explorer status
  - Countdown timer display
  - Convert account button
  - Status notifications

- **Progress Tracking**
  - All sections pre-completed
  - Visual progress indicators
  - Conversion requirements shown
  - Step-by-step guidance

### Best Practices
1. **Using Explorer Mode**
   - Start with feature exploration
   - Test space configurations
   - Review analytics capabilities
   - Understand conversion benefits

2. **Converting to Full Account**
   - Complete identity verification first
   - Review space configuration
   - Set up permanent CSMCL.ID
   - Configure wallet integration

3. **Data Management**
   - Export important configurations
   - Document preferred settings
   - Plan space structure
   - Prepare for verification

### Limitations
- **Time Restriction**
  - 24-hour access limit
  - No extension without conversion
  - Session expiration enforced
  - Auto-logout after expiry

- **Feature Restrictions**
  - No external space connections
  - Limited transaction capabilities
  - Read-only network interactions
  - No permanent data storage

### Error Handling
- **Session Expiration**
  - Graceful timeout handling
  - Clear error messages
  - Conversion prompts
  - Data cleanup process

- **Failed Operations**
  - User-friendly error displays
  - Alternative action suggestions
  - Help documentation links
  - Support contact options

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

## Project Structure

```
csmclspace_onboarding/
├── src/
│   ├── components/
│   │   ├── Navbar.vue                    # Main navigation component
│   │   ├── profile/
│   │   │   └── OnboardingProgress.vue    # Onboarding progress tracking
│   │   ├── registration/
│   │   │   ├── IdentityForm.vue          # User registration form
│   │   │   └── VerificationForm.vue      # Identity verification
│   │   └── space-setup/
│   │       └── SpaceSetup.vue            # Space configuration
│   ├── views/
│   │   ├── Home.vue                     # Landing page
│   │   ├── Login.vue                    # User login with explorer mode
│   │   ├── Profile.vue                  # User profile and analytics
│   │   ├── Documentation.vue            # Documentation page
│   │   └── Onboarding.vue               # Onboarding layout
│   ├── stores/
│   │   └── user.js                     # User and metrics state management
│   ├── router/
│   │   └── index.js                   # Route configuration
│   └── main.js                        # Application entry point
```

## Routes

- `/` - Home page
- `/login` - User login with explorer option
- `/profile` - Protected user profile with analytics
- `/documentation` - Public documentation
- `/onboarding/*` - Registration flow:
  - `/onboarding/identity` - Identity creation
  - `/onboarding/verify` - Identity verification
  - `/onboarding/space` - Space setup
  - `/onboarding/wallet` - Wallet connection

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   - Copy `.env.example` to `.env`
   - Set required environment variables

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Required variables in `.env`:
- `VITE_API_URL` - Backend API endpoint
- `VITE_APP_TITLE` - Application title
- Additional configuration as needed

## Design System

### Colors
- Primary: Blue (#3B82F6)
- Background: Dark (#111827)
- Text: White/Gray
- Accents: Various opacity blues

### Components
- Forms with consistent styling
- Responsive navigation
- Error states with visual feedback
- Loading states and transitions

## Best Practices

### Code Style
- Vue 3 Composition API
- TypeScript for type safety
- Modular component design
- Consistent naming conventions

### Security
- Input validation
- XSS prevention
- CSRF protection
- Rate limiting

### Performance
- Lazy-loaded routes
- Optimized imports
- Efficient state management
- Minimal dependencies

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

[License Type] - See LICENSE file for details
