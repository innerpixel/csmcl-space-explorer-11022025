# CSMCL.Space Onboarding

A modern Vue.js application for CSMCL.Space user onboarding and identity management. This application provides a seamless experience for users to create and manage their CSMCL identity, verify their account, set up their space, and connect their wallet.

## Features

### User Authentication
- Secure login system with rate limiting and challenge verification
- Session management using Pinia store
- Protected routes with navigation guards

### User Registration
- Multi-step onboarding process:
  1. CSMCL.Identity Creation / account setup and recovery
     - Display name (minimum 2 words, 3+ letters each)
     - Custom email with @csmcl.space domain
     - Recovery phrase for account security
     - Security challenge verification
  2. KYC/Identity Verification / account verification / compliance check 
  3. Space Setup NFT / space configuration / email setup and connection in app 
  4. Wallet Setup / blockchain integration flow network connection

  ONBOARDING COMPLETED
  
  - DISCOVER CSMCL SPACE 
  - ACCESS TO DASHBOARD
  - CHATTER / TRANSACTIONS
  - NFTS Collection / Buy/Sale access to escrow

### Navigation
- Responsive navigation bar with:
  - Dynamic route highlighting
  - User menu for logged-in users
  - Conditional "Get Started" button
  - Documentation access

### Security Features
- Rate limiting with temporary lockouts
- Challenge-response verification
- Secure phrase hashing
- Protected routes
- Input validation and sanitization

## Project Structure

```
vue-fcl-landing/
├── src/
│   ├── components/
│   │   ├── Navbar.vue              # Main navigation component
│   │   ├── registration/
│   │   │   ├── IdentityForm.vue    # User registration form
│   │   │   └── VerificationForm.vue# Identity verification
│   │   └── space-setup/
│   │       └── SpaceSetup.vue      # Space configuration
│   ├── views/
│   │   ├── Home.vue               # Landing page
│   │   ├── Login.vue              # User login
│   │   ├── Profile.vue            # User profile
│   │   ├── Documentation.vue      # Documentation page
│   │   └── Onboarding.vue         # Onboarding layout
│   ├── stores/
│   │   └── user.js               # User state management
│   ├── router/
│   │   └── index.js             # Route configuration
│   └── main.js                  # Application entry point
```

## Routes

- `/` - Home page
- `/login` - User login
- `/profile` - Protected user profile
- `/documentation` - Public documentation
- `/onboarding/*` - Registration flow:
  - `/onboarding/identity` - Identity creation
  - `/onboarding/verify` - Identity verification
  - `/onboarding/space` - Space setup

## Security

### Authentication Flow
1. User enters credentials
2. Challenge verification required
3. Rate limiting enforced (5 attempts)
4. 15-minute lockout after failed attempts
5. Secure session management

### Data Protection
- Passwords and recovery phrases are hashed
- Input sanitization for all user data
- Protected routes require authentication
- Session validation on navigation

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
