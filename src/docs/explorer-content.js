export const explorerDocumentation = `# CSMCL.Explorer Guide

Welcome to CSMCL.Explorer mode! This guide will help you make the most of your temporary access to CSMCL.Space.

## Quick Start

### What is Explorer Mode?
CSMCL.Explorer is a temporary account that gives you 10-day access to experience CSMCL.Space. You can explore essential features and functionalities without committing to a full registration.

### Time Limitation
- Your session is valid for 10 days from activation
- A countdown timer shows remaining time in days and hours
- You'll receive notifications as the expiration approaches
- Option to convert to full account at any time

## Features Available

### 1. Pre-configured Space
- **Theme**: cosmic-explorer (optimized for exploration)
- **Template**: explorer template with guided features
- **Visibility**: private mode enabled
- **Size**: medium space configuration
- **Boundaries**: default protective settings

### 2. Space Analytics
Your explorer space includes:
- Activity tracking and interactions
- Network connection metrics
- Transaction monitoring
- Social engagement stats
- Space traffic analysis
- Request management

### 3. Identity Features
- Temporary CSMCL.Explorer identity
- Basic profile configuration
- Limited network visibility
- Read-only external access
- Identity setup form access

## Converting to Full Account

### Why Convert?
- Permanent CSMCL identity
- Full space customization
- Complete network access
- Advanced features access
- Persistent data storage
- Full verification status

### How to Convert
1. Complete the identity setup form
2. Verify your email and SIM number
3. Set up your permanent CSMCL.ID
4. Configure your space preferences
5. Complete the onboarding process

### Data Handling
When converting:
- Identity information can be preserved
- Analytics will reset for fresh start
- New permanent credentials issued
- Verification status transferred
- Space settings customizable

## Security Information

### Access Limitations
- Limited feature access
- No permanent data storage
- Protected space boundaries
- Monitored activity logs
- Temporary session management

### Data Protection
- No sensitive data storage
- Encrypted temporary data
- Auto-cleanup after expiration
- Memory-only operations
- Secure state management

## Best Practices

### Making the Most of Explorer Mode
1. **Explore Features**
   - Test identity setup process
   - Review analytics capabilities
   - Try verification features
   - Experiment with space settings

2. **Prepare for Conversion**
   - Complete identity verification
   - Plan your permanent setup
   - Note desired configurations
   - Prepare verification details

3. **Security Awareness**
   - Monitor session expiry
   - Keep track of activities
   - Review security settings
   - Understand data handling

## Need Help?

### Support Resources
- Documentation: docs.csmcl.space/explorer
- Community: community.csmcl.space
- Email: support@csmcl.space

### Common Questions
1. **Can I extend my explorer session?**
   - No extensions available
   - Convert to full account instead
   - 10-day limit is fixed

2. **What happens to my data?**
   - Automatically cleared after expiration
   - Option to save during conversion
   - No sensitive data stored

3. **Can I return to explorer mode?**
   - One explorer session per user
   - Full account recommended for return users
   - Cannot reactivate expired sessions

## Technical Details

### Storage Security
\`\`\`javascript
// Storage Encryption Configuration
const storageEncryption = {
  // Encryption settings
  encryption: {
    algorithm: 'AES-256-GCM',
    keyDerivation: 'PBKDF2',
    iterations: 100000,
    saltLength: 16,
    ivLength: 12
  },

  // Encrypted storage handler
  encryptedStorage: {
    setItem: (key, value) => {
      const encryptedData = encryptData(value)
      localStorage.setItem(key, JSON.stringify(encryptedData))
    },
    getItem: (key) => {
      const encryptedData = JSON.parse(localStorage.getItem(key))
      return decryptData(encryptedData)
    },
    removeItem: (key) => {
      localStorage.removeItem(key)
    }
  },

  // Sensitive data fields requiring encryption
  sensitiveFields: [
    'verificationEmail',
    'simNumber',
    'phraseHash',
    'sessionToken',
    'tempCredentials'
  ]
}

// Local Storage Data Structure with Encryption
const localStorage = {
  // User Store Data (Encrypted)
  'user': {
    user: {
      displayName: 'CSMCL.Explorer', // Not encrypted (public)
      email: null // Encrypted when set
    },
    role: 'explorer', // Not encrypted (public)
    isExplorer: true, // Not encrypted (public)
    explorerExpiry: '2025-01-14T16:58:51+02:00', // Not encrypted (public)
    verificationStatus: {
      verificationEmail: false, // Status only, not the actual email
      simNumber: false // Status only, not the actual number
    },
    stepProgress: {
      identity: { started: true, completed: false },
      space: { started: false, completed: false },
      csmclId: { started: false, completed: false },
      wallet: { started: false, completed: false }
    },
    // Encrypted Metrics
    spaceMetrics: {
      activity: { interactions: 0, chatter: 0 },
      network: { connections: 0, pending: 0 },
      transactions: { sent: 0, received: 0 },
      social: { shares: 0, engagement: 0 },
      requests: { sent: 0, received: 0 },
      traffic: { inbound: 0, outbound: 0 }
    },
    space: {
      theme: 'cosmic-explorer',
      visibility: 'private',
      accessibility: {
        public: false,
        friends: true,
        private: true
      },
      boundaries: {
        size: 'medium',
        expandable: true
      },
      template: 'explorer'
    }
  },

  // Documentation Progress (Not Encrypted - Public Data)
  'docs': {
    currentSection: 'getting-started',
    progress: {
      'getting-started': true,
      'features': false,
      'security': false,
      'conversion': false
    },
    lastVisited: '2025-01-04T16:58:51+02:00'
  }
}

// Explorer Session Configuration
const explorerConfig = {
  // Session Management
  session: {
    duration: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
    checkInterval: 5 * 60 * 1000, // Check every 5 minutes
    warningThreshold: 24 * 60 * 60 * 1000 // Warn when 24 hours remain
  },

  // Security Configuration
  security: {
    encryption: {
      enabled: true,
      algorithm: 'AES-256-GCM',
      keyDerivation: 'PBKDF2'
    },
    storage: {
      type: 'encrypted',
      persistence: 'session-only',
      cleanup: 'auto'
    },
    session: {
      tokenRefresh: true,
      tokenExpiry: '1h',
      secureFlag: true
    }
  },

  // Access Control
  access: {
    level: 'explorer',
    permissions: {
      space: 'read-write',
      network: 'read-only',
      analytics: 'basic-access',
      storage: 'temporary'
    }
  },

  // Feature Configuration
  features: {
    identity: {
      setup: true,
      verification: true,
      customization: false
    },
    space: {
      theme: 'cosmic-explorer',
      template: 'explorer',
      customization: false
    }
  },

  // State Management
  state: {
    persistedKeys: [
      'user',
      'docs',
      'preferences',
      'sessionMetrics'
    ],
    volatileKeys: [
      'tempData',
      'cache',
      'buffers'
    ],
    encryptedKeys: [
      'verificationEmail',
      'simNumber',
      'phraseHash',
      'sessionToken',
      'tempCredentials'
    ]
  },

  // Cleanup Handlers
  cleanup: {
    onExpiry: ['user', 'sessionMetrics', 'tempData'],
    onLogout: ['cache', 'buffers'],
    preserveOnConversion: ['docs', 'preferences']
  }
}

// API Rate Limits
const apiLimits = {
  requests: {
    perSecond: 5,
    perMinute: 100,
    perHour: 1000
  },
  endpoints: {
    '/api/space': { method: 'GET', limit: 100 },
    '/api/metrics': { method: 'GET', limit: 50 },
    '/api/identity': { method: 'POST', limit: 10 }
  },
  headers: {
    'X-Explorer-ID': 'Required',
    'X-Session-ID': 'Required',
    'X-Rate-Limit': 'Included'
  }
}
\`\`\`

### Data Security
- **Encryption**: AES-256-GCM encryption for sensitive data
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Storage Segregation**: 
  - Public data stored unencrypted
  - Sensitive data always encrypted
  - Session-only storage for temporary data
- **Automatic Cleanup**:
  - Secure data wiping on session end
  - Encrypted data auto-removal
  - Memory cleanup routines

### Data Persistence
- Local storage used for session data
- State management through Pinia store
- Automatic cleanup on expiration
- Secure data handling
- Rate limiting enforcement

### API Access
- Limited to essential endpoints
- Read-only external APIs
- Rate limits applied
- Authentication required
- Session expiry monitoring

Remember: Explorer mode gives you 10 days to experience CSMCL.Space. If you find yourself wanting more, converting to a full account unlocks all features and permanent access!`
