import CryptoJS from 'crypto-js'
import { generateMnemonic, validateMnemonic, mnemonicToSeedSync } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'

// Flow specific constants
const FLOW_ENTROPY_BITS = 128 // For 12-word mnemonic
const FLOW_WORD_COUNT = 12

// Validate Flow recovery phrase
const validateFlowPhrase = (phrase) => {
  try {
    if (!phrase) return false
    return validateMnemonic(phrase.trim(), wordlist)
  } catch (error) {
    console.error('Phrase validation error:', error)
    return false
  }
}

// Storage keys for different user types
const STORAGE_KEYS = {
  USERS: 'csmcl-users-v2',
  DEMO_BOTS: 'csmcl-bots',
  SUBMITTED_USERS: 'csmcl-submitted',   // Users submitted to backend
  EXPLORER_EXPIRY: 'explorer_expiry'    // Explorer session expiry
}

const MAX_USER_LIMIT = 3

/**
 * User Naming Rules and Guidelines
 * -------------------------------
 * 
 * CosmicalName (System Username):
 * - Must start with a lowercase letter
 * - Can only contain lowercase letters, numbers, and hyphens
 * - Cannot end with a hyphen
 * - Length: 1-32 characters
 * - Examples: 'john-doe', 'cosmic-explorer123'
 * - Will be used as your system username and email prefix (@csmcl.space)
 * - Cannot be changed after account creation
 * 
 * DisplayName (Public Name):
 * - Maximum 3 words, including emoji
 * - Length: 1-25 characters
 * - Can include one emoji
 * - Examples: '🚀 Space Cat', '⭐ Alice', '🌌 Code Master'
 * - Can be changed anytime
 * 
 * About Me:
 * - Array of short facts about the user
 * - Each fact: 1-50 characters
 * - Maximum 5 facts
 * - Examples: ['Loves space exploration', 'Python developer', 'Quantum physics enthusiast']
 * 
 * Special System Users:
 * - csmcl-admin: System administrator
 * - csmcl-explorer: Guest explorer account
 */

// Validation rules for user fields
const validationRules = {
  cosmicalName: {
    minLength: 1,
    maxLength: 32,
    pattern: /^[a-z][a-z0-9-]*[a-z0-9]$/,
    message: 'Username must start with a lowercase letter, contain only lowercase letters, numbers, and hyphens, and not end with a hyphen'
  },
  displayName: {
    minLength: 1,
    maxLength: 25,
    // One emoji optional, max 3 words
    pattern: /^(?:\p{Emoji}\p{Emoji_Component}*\s)?[\p{L}\p{N}]+(?:\s[\p{L}\p{N}]+){0,2}$/u,
    message: 'Display name can have one emoji and up to 3 words, maximum 25 characters'
  },
  aboutMe: {
    maxItems: 5,
    itemMaxLength: 50,
    message: 'About me can have up to 5 facts, each maximum 50 characters'
  },
  verifyEmail: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format'
  },
  simNumber: {
    pattern: /^\+?[1-9]\d{1,14}$/,
    message: 'Please enter a valid phone number in international format (e.g., +27123456789)'
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Password must be at least 8 characters and contain uppercase, lowercase, number and special character'
  },
  phrase: {
    minWords: FLOW_WORD_COUNT,
    validate: validateFlowPhrase,
    message: `Recovery phrase must be ${FLOW_WORD_COUNT} words from the BIP39 wordlist`
  }
}

// Common words to suggest in phrases
const PHRASE_SUGGESTIONS = [
  ['authentication', 'verification', 'identification'],
  ['secure', 'protect', 'validate'],
  ['digital', 'quantum', 'network'],
  ['cosmic', 'galaxy', 'universe'],
  ['blockchain', 'cryptography', 'security']
]

// Generate Flow-compatible recovery phrase
const generateFlowRecoveryPhrase = () => {
  try {
    return generateMnemonic(wordlist, FLOW_ENTROPY_BITS)
  } catch (error) {
    console.error('Phrase generation error:', error)
    throw error
  }
}

// Get seed from phrase (for Flow proof of ownership)
const getFlowSeed = (phrase) => {
  try {
    const seed = mnemonicToSeedSync(phrase)
    return CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.create(seed))
  } catch (error) {
    console.error('Seed generation error:', error)
    throw error
  }
}

// Get random phrase suggestion
const getRandomPhraseSuggestion = () => {
  const randomWords = []
  const usedIndices = new Set()
  
  // Get 3 random words from different categories
  while (randomWords.length < 3) {
    const categoryIndex = Math.floor(Math.random() * PHRASE_SUGGESTIONS.length)
    if (!usedIndices.has(categoryIndex)) {
      const category = PHRASE_SUGGESTIONS[categoryIndex]
      const wordIndex = Math.floor(Math.random() * category.length)
      randomWords.push(category[wordIndex])
      usedIndices.add(categoryIndex)
    }
  }
  
  return randomWords.join(' ')
}

// Calculate phrase strength (0-100)
const calculatePhraseStrength = (phrase) => {
  if (!phrase) return 0
  
  const words = phrase.trim().split(/\s+/)
  let score = 0
  
  // Word count (max 40 points)
  score += Math.min(words.length * 10, 40)
  
  // Word length (max 30 points)
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length
  score += Math.min(avgWordLength * 3, 30)
  
  // Uniqueness (max 30 points)
  const uniqueWords = new Set(words.map(w => w.toLowerCase()))
  score += (uniqueWords.size / words.length) * 30
  
  return Math.min(Math.round(score), 100)
}

// Encrypt sensitive data
const encryptData = (data, salt) => {
  try {
    const key = CryptoJS.PBKDF2(salt, salt, {
      keySize: 256 / 32,
      iterations: 1000
    })
    return CryptoJS.AES.encrypt(data, key.toString()).toString()
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

// Decrypt sensitive data
const decryptData = (encryptedData, salt) => {
  try {
    const key = CryptoJS.PBKDF2(salt, salt, {
      keySize: 256 / 32,
      iterations: 1000
    })
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key.toString())
    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

const defaultUsers = [
  {
    cosmicalName: 'csmcl-admin',
    displayName: '🛡️ CSMCL Admin',
    aboutMe: [
      'System administrator',
      'Network security expert',
      'Here to help!'
    ],
    role: 'admin',
    isAdmin: true,
    isVerified: false,
    emailVerified: false,
    simVerified: false,
    requiresInit: true,
    kycCompliance: {
      status: 'pending',
      level: 'none',
      documents: [],
      lastChecked: null,
      expiryDate: null
    }
  },
  {
    cosmicalName: 'csmcl-explorer',
    displayName: '🚀 Space Kid',
    aboutMe: [
      'Just passing through the cosmos',
      'Learning about space',
      'First time in orbit!'
    ],
    role: 'explorer',
    isExplorer: true,
    isVerified: true,
    emailVerified: true,
    simVerified: true,
    requiresInit: false,
    kycCompliance: {
      status: 'approved',
      level: 'explorer',
      documents: [],
      lastChecked: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }
  }
]

// Demo bots for the explorer mode
const demoBots = {
  alice: {
    type: 'bot',
    displayName: 'Alice (Teacher)',
    behavior: 'teacher',
    interactions: ['explains', 'guides']
  },
  bob: {
    type: 'bot',
    displayName: 'Bob (Student)',
    behavior: 'student',
    interactions: ['asks', 'learns']
  }
}

// Password generation constants
const PASSWORD_CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

const PASSWORD_CONFIG = {
  minLength: 16,
  minUppercase: 2,
  minLowercase: 2,
  minNumbers: 2,
  minSymbols: 2
}

// Generate a cryptographically secure password
const generateSecurePassword = () => {
  try {
    let password = ''
    const allChars = Object.values(PASSWORD_CHARS).join('')
    
    // Ensure minimum requirements for each character type
    password += getRandomChars(PASSWORD_CHARS.uppercase, PASSWORD_CONFIG.minUppercase)
    password += getRandomChars(PASSWORD_CHARS.lowercase, PASSWORD_CONFIG.minLowercase)
    password += getRandomChars(PASSWORD_CHARS.numbers, PASSWORD_CONFIG.minNumbers)
    password += getRandomChars(PASSWORD_CHARS.symbols, PASSWORD_CONFIG.minSymbols)
    
    // Fill remaining length with random characters
    const remainingLength = PASSWORD_CONFIG.minLength - password.length
    password += getRandomChars(allChars, remainingLength)
    
    // Shuffle the password to avoid predictable patterns
    return shuffleString(password)
  } catch (error) {
    console.error('Password generation error:', error)
    throw error
  }
}

// Get random characters from a string
const getRandomChars = (chars, length) => {
  let result = ''
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(array[i] % chars.length)]
  }
  return result
}

// Cryptographically secure string shuffle
const shuffleString = (str) => {
  const array = str.split('')
  const uint32 = new Uint32Array(array.length)
  crypto.getRandomValues(uint32)
  
  // Fisher-Yates shuffle with crypto random values
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(uint32[i] % (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  
  return array.join('')
}

// Validate password strength
const validatePassword = (password) => {
  if (!password) return { valid: false, score: 0, issues: ['Password is required'] }
  
  const issues = []
  let score = 0
  
  // Check minimum length
  if (password.length < PASSWORD_CONFIG.minLength) {
    issues.push(`Password must be at least ${PASSWORD_CONFIG.minLength} characters`)
  } else {
    score += 25
  }
  
  // Check character types
  const hasUppercase = (password.match(/[A-Z]/g) || []).length >= PASSWORD_CONFIG.minUppercase
  const hasLowercase = (password.match(/[a-z]/g) || []).length >= PASSWORD_CONFIG.minLowercase
  const hasNumbers = (password.match(/[0-9]/g) || []).length >= PASSWORD_CONFIG.minNumbers
  const hasSymbols = (password.match(/[^A-Za-z0-9]/g) || []).length >= PASSWORD_CONFIG.minSymbols
  
  if (!hasUppercase) issues.push(`At least ${PASSWORD_CONFIG.minUppercase} uppercase letters required`)
  if (!hasLowercase) issues.push(`At least ${PASSWORD_CONFIG.minLowercase} lowercase letters required`)
  if (!hasNumbers) issues.push(`At least ${PASSWORD_CONFIG.minNumbers} numbers required`)
  if (!hasSymbols) issues.push(`At least ${PASSWORD_CONFIG.minSymbols} special characters required`)
  
  score += hasUppercase ? 25 : 0
  score += hasLowercase ? 25 : 0
  score += hasNumbers ? 15 : 0
  score += hasSymbols ? 10 : 0
  
  return {
    valid: issues.length === 0,
    score,
    issues
  }
}

class UserDb {
  constructor() {
    this.initDb()
  }

  initDb() {
    try {
      // Initialize storage if not exists
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]))
      }
      if (!localStorage.getItem(STORAGE_KEYS.DEMO_BOTS)) {
        localStorage.setItem(STORAGE_KEYS.DEMO_BOTS, JSON.stringify(demoBots))
      }

      // Get current users
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      
      // Remove any existing default users first
      const filteredUsers = users.filter(u => 
        u.cosmicalName !== 'csmcl-admin' && 
        u.cosmicalName !== 'csmcl-explorer'
      )

      // Add default users if they don't exist
      const admin = defaultUsers.find(u => u.cosmicalName === 'csmcl-admin')
      const explorer = defaultUsers.find(u => u.cosmicalName === 'csmcl-explorer')
      
      if (admin) filteredUsers.push(admin)
      if (explorer) filteredUsers.push(explorer)

      // Update storage with clean user list
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers))

      return true
    } catch (error) {
      console.error('Init DB error:', error)
      return false
    }
  }

  // Get explorer expiry
  getExplorerExpiry() {
    return localStorage.getItem(STORAGE_KEYS.EXPLORER_EXPIRY)
  }

  // Set explorer expiry
  setExplorerExpiry(expiry) {
    if (expiry) {
      localStorage.setItem(STORAGE_KEYS.EXPLORER_EXPIRY, expiry)
    } else {
      localStorage.removeItem(STORAGE_KEYS.EXPLORER_EXPIRY)
    }
  }

  // Get a random phrase suggestion
  getPhrasesuggestion() {
    return getRandomPhraseSuggestion()
  }

  // Calculate phrase strength
  getPhraseStrength(phrase) {
    return calculatePhraseStrength(phrase)
  }

  // Get a Flow-compatible recovery phrase
  getRecoveryPhrase() {
    return generateFlowRecoveryPhrase()
  }

  // Validate recovery phrase
  validatePhrase(phrase) {
    return validateFlowPhrase(phrase)
  }

  validateUser(userData) {
    try {
      if (!userData || typeof userData !== 'object') {
        console.error('Invalid user data:', userData)
        return {
          isValid: false,
          error: 'Invalid user data'
        }
      }

      const { cosmicalName } = userData
      if (!cosmicalName) {
        console.error('Missing cosmicalName:', userData)
        return {
          isValid: false,
          error: 'Username is required'
        }
      }

      // Validate cosmicalName
      const nameValidation = this.validateCosmicalName(cosmicalName)
      if (!nameValidation.isValid) {
        return nameValidation
      }

      return {
        isValid: true,
        email: nameValidation.email
      }
    } catch (error) {
      console.error('User validation error:', error)
      return {
        isValid: false,
        error: 'Validation failed'
      }
    }
  }

  validateCosmicalName(cosmicalName, isSubmitted = false) {
    try {
      // Handle null/undefined cosmicalName
      if (!cosmicalName) {
        console.error('Invalid cosmicalName:', cosmicalName)
        return {
          isValid: false,
          error: 'Username is required'
        }
      }

      // Normalize cosmicalName to lowercase
      const normalizedName = cosmicalName.trim().toLowerCase()
      
      // Special case for admin and explorer
      if (normalizedName === 'csmcl-admin' || normalizedName === 'csmcl-explorer') {
        return {
          isValid: true,
          email: `${normalizedName}@csmcl.space`
        }
      }

      // Check if already exists
      const localUsers = this.getLocalUsers()
      const submittedUsers = this.getSubmittedUsers()
      const existingUser = [...localUsers, ...submittedUsers].find(
        u => u.cosmicalName.toLowerCase() === normalizedName
      )

      if (existingUser && !isSubmitted) {
        return {
          isValid: false,
          error: 'Username already taken'
        }
      }

      // Validate format
      if (!/^[a-z0-9-_]{3,20}$/.test(normalizedName)) {
        return {
          isValid: false,
          error: 'Username must be 3-20 characters and can only contain letters, numbers, hyphens and underscores'
        }
      }

      // Generate email
      const email = `${normalizedName}@csmcl.space`

      return {
        isValid: true,
        email
      }
    } catch (error) {
      console.error('Name validation error:', error)
      return {
        isValid: false,
        error: 'Invalid username'
      }
    }
  }

  getUser(cosmicalName, includePrivate = false) {
    try {
      // Handle null/undefined cosmicalName
      if (!cosmicalName) {
        console.error('Invalid cosmicalName:', cosmicalName)
        return null
      }

      // Normalize cosmicalName
      const normalizedName = cosmicalName.trim().toLowerCase()

      // First check default users
      const defaultUser = defaultUsers.find(u => u.cosmicalName === normalizedName)
      if (defaultUser) {
        // Clone the default user to avoid modifying the template
        const user = JSON.parse(JSON.stringify(defaultUser))
        
        // Get users from storage
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
        
        // Check if user exists in local storage
        const localUser = users.find(u => u.cosmicalName === normalizedName)
        if (localUser) {
          // Return local version if it exists
          return includePrivate ? localUser : { ...localUser, phrase: undefined }
        }
        
        // Add default user to local storage
        users.push(user)
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
        
        return includePrivate ? user : { ...user, phrase: undefined }
      }

      // If not a default user, check local storage
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      const user = users.find(u => u.cosmicalName === normalizedName)
      
      if (!user) return null

      return includePrivate ? user : { ...user, phrase: undefined }
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  }

  updateUser(cosmicalName, updates) {
    try {
      if (!cosmicalName) {
        console.error('Invalid cosmicalName:', cosmicalName)
        return false
      }

      // Normalize cosmicalName
      const normalizedName = cosmicalName.trim().toLowerCase()
      
      // Get current users
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      
      // Find user index
      const userIndex = users.findIndex(u => u.cosmicalName === normalizedName)
      
      // Special handling for default users
      if (userIndex === -1) {
        const defaultUser = defaultUsers.find(u => u.cosmicalName === normalizedName)
        if (defaultUser) {
          // Clone default user and apply updates
          const newUser = JSON.parse(JSON.stringify({
            ...defaultUser,
            ...updates,
            lastUpdated: new Date().toISOString()
          }))
          
          // Add to local storage
          users.push(newUser)
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
          return true
        }
        return false
      }

      // Update existing user
      users[userIndex] = {
        ...users[userIndex],
        ...updates,
        lastUpdated: new Date().toISOString()
      }
      
      // Save back to storage
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
      return true
    } catch (error) {
      console.error('Update user error:', error)
      return false
    }
  }

  // Get all local users
  getLocalUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
  }

  // Get all submitted users
  getSubmittedUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMITTED_USERS) || '[]')
  }

  // Get bot users
  getBotUsers() {
    const demoBotsJson = localStorage.getItem(STORAGE_KEYS.DEMO_BOTS)
    const allDemoBots = demoBotsJson ? JSON.parse(demoBotsJson) : demoBots
    return allDemoBots
  }

  getUserCount() {
    const localUsers = this.getLocalUsers()
    const submittedUsers = this.getSubmittedUsers()
    
    return {
      total: localUsers.length + submittedUsers.length,
      local: localUsers.length,
      submitted: submittedUsers.length,
      remaining: MAX_USER_LIMIT - (localUsers.length + submittedUsers.length)
    }
  }

  createLocalUser(userData) {
    try {
      const errors = this.validateUser(userData)
      if (errors.length > 0) {
        throw new Error(errors.join(', '))
      }

      // Check if user exists locally
      const existingUser = this.getUser(userData.cosmicalName)
      if (existingUser) {
        throw new Error('User already exists locally')
      }

      // Validate cosmical name and get email
      const validation = this.validateCosmicalName(userData.cosmicalName, userData.isSubmitted || false)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      const newUser = {
        ...userData,
        cosmicalName: userData.cosmicalName.trim().toLowerCase(),
        verifyEmail: validation.email,
        aboutMe: userData.aboutMe || [],
        isVerified: false,
        emailVerified: false,
        simVerified: false,
        kycCompliance: {
          status: 'pending',
          level: 'none',
          documents: [],
          lastChecked: null,
          expiryDate: null
        },
        createdAt: new Date().toISOString(),
        metrics: {
          xp: 0,
          level: 'novice',
          achievements: []
        }
      }

      const localUsers = this.getLocalUsers()
      localUsers.push(newUser)
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(localUsers))

      return newUser
    } catch (error) {
      console.error('Create user error:', error)
      throw error
    }
  }

  // Submit a local user to backend
  async submitUserToBackend(cosmicalName) {
    const localUsers = this.getLocalUsers()
    const submittedUsers = this.getSubmittedUsers()
    const userIndex = localUsers.findIndex(u => u.cosmicalName === cosmicalName)
    
    if (userIndex === -1) {
      throw new Error('User not found in local storage')
    }

    const user = localUsers[userIndex]
    if (user.isSubmitted) {
      throw new Error('User already submitted')
    }

    try {
      // Here we would make the actual API call
      // await api.submitUser(user)

      // Mark user as submitted
      user.isSubmitted = true
      user.submittedAt = new Date().toISOString()
      user.status = 'submitted'
      
      // Remove from local users
      localUsers.splice(userIndex, 1)
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(localUsers))

      // Add to submitted users
      submittedUsers.push(user)
      localStorage.setItem(STORAGE_KEYS.SUBMITTED_USERS, JSON.stringify(submittedUsers))

      return true
    } catch (error) {
      console.error('Failed to submit user:', error)
      throw error
    }
  }

  deleteUser(cosmicalName) {
    // Try deleting from local users
    let localUsers = this.getLocalUsers()
    const localIndex = localUsers.findIndex(u => u.cosmicalName === cosmicalName)
    
    if (localIndex !== -1) {
      localUsers.splice(localIndex, 1)
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(localUsers))
      return true
    }

    // Try deleting from submitted users
    let submittedUsers = this.getSubmittedUsers()
    const submittedIndex = submittedUsers.findIndex(u => u.cosmicalName === cosmicalName)
    
    if (submittedIndex !== -1) {
      submittedUsers.splice(submittedIndex, 1)
      localStorage.setItem(STORAGE_KEYS.SUBMITTED_USERS, JSON.stringify(submittedUsers))
      return true
    }

    return false
  }

  // Get a secure generated password
  getSecurePassword() {
    return generateSecurePassword()
  }

  // Validate password
  validatePassword(password) {
    return validatePassword(password)
  }

  // Add verification methods
  async verifyEmail(cosmicalName, code) {
    try {
      const user = this.getUser(cosmicalName, true)
      if (!user) throw new Error('User not found')

      // TODO: Implement actual email verification logic
      // For now, just mark as verified
      await this.updateUser(cosmicalName, {
        emailVerified: true,
        isVerified: user.simVerified // Only mark as fully verified if both are verified
      })

      return true
    } catch (error) {
      console.error('Email verification error:', error)
      throw error
    }
  }

  async verifySim(cosmicalName, code) {
    try {
      const user = this.getUser(cosmicalName, true)
      if (!user) throw new Error('User not found')

      // TODO: Implement actual SIM verification logic
      // For now, just mark as verified
      await this.updateUser(cosmicalName, {
        simVerified: true,
        isVerified: user.emailVerified // Only mark as fully verified if both are verified
      })

      return true
    } catch (error) {
      console.error('SIM verification error:', error)
      throw error
    }
  }

  async verifyKYC(cosmicalName, documents) {
    try {
      const user = this.getUser(cosmicalName, true)
      if (!user) throw new Error('User not found')

      // TODO: Implement actual KYC verification logic
      // This would typically involve:
      // 1. Document validation
      // 2. Identity verification
      // 3. Background checks
      // 4. Risk assessment

      const kycCompliance = {
        status: 'approved',
        level: 'basic',
        documents: documents,
        lastChecked: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year expiry
      }

      await this.updateUser(cosmicalName, {
        kycCompliance,
        isVerified: user.emailVerified && user.simVerified // Only mark as fully verified if all checks pass
      })

      return true
    } catch (error) {
      console.error('KYC verification error:', error)
      throw error
    }
  }

  needsKYCRenewal(cosmicalName) {
    try {
      const user = this.getUser(cosmicalName)
      if (!user) return true

      const kyc = user.kycCompliance
      if (!kyc || kyc.status !== 'approved') return true

      // Check if KYC is expired or about to expire (within 30 days)
      const expiryDate = new Date(kyc.expiryDate)
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      
      return expiryDate <= thirtyDaysFromNow
    } catch (error) {
      console.error('KYC renewal check error:', error)
      return true
    }
  }

  cleanupDuplicateUsers() {
    try {
      // Get current users
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      
      // Keep track of seen usernames to remove duplicates
      const seen = new Set()
      const cleanUsers = users.filter(user => {
        if (seen.has(user.cosmicalName)) {
          return false // Skip duplicate
        }
        seen.add(user.cosmicalName)
        return true
      })

      // Update storage with deduplicated list
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(cleanUsers))
      
      return true
    } catch (error) {
      console.error('Cleanup duplicates error:', error)
      return false
    }
  }

  resetDatabase() {
    try {
      // Clear all storage
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })

      // Reinitialize with clean state
      this.initDb()
      
      // Run cleanup to ensure no duplicates
      this.cleanupDuplicateUsers()
      
      return true
    } catch (error) {
      console.error('Reset database error:', error)
      return false
    }
  }

  completeReset() {
    try {
      // Clear ALL localStorage
      localStorage.clear()

      // Reset to initial state with default users
      const freshDefaultUsers = [
        {
          cosmicalName: 'csmcl-admin',
          displayName: '🛡️ CSMCL Admin',
          aboutMe: [
            'System administrator',
            'Network security expert',
            'Here to help!'
          ],
          role: 'admin',
          isAdmin: true,
          isVerified: false,
          emailVerified: false,
          simVerified: false,
          requiresInit: true, // Admin needs initialization
          kycCompliance: {
            status: 'pending',
            level: 'none',
            documents: [],
            lastChecked: null,
            expiryDate: null
          }
        },
        {
          cosmicalName: 'csmcl-explorer',
          displayName: '🚀 Space Kid',
          aboutMe: [
            'Just passing through the cosmos',
            'Learning about space',
            'First time in orbit!'
          ],
          role: 'explorer',
          isExplorer: true,
          isVerified: true,
          emailVerified: true,
          simVerified: true,
          requiresInit: false,
          kycCompliance: {
            status: 'approved',
            level: 'explorer',
            documents: [],
            lastChecked: new Date().toISOString(),
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      ]

      // Set fresh default users
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(freshDefaultUsers))
      localStorage.setItem(STORAGE_KEYS.SUBMITTED_USERS, JSON.stringify([]))

      // Force initialization
      this.initDb()

      return true
    } catch (error) {
      console.error('Complete reset error:', error)
      return false
    }
  }

  validateAdminReset(cosmicalName) {
    // Normalize cosmicalName to lowercase
    const normalizedName = cosmicalName.trim().toLowerCase()
    
    // Only allow reset for admin user
    if (normalizedName !== 'csmcl-admin') return false

    const adminUser = this.getUser('csmcl-admin')
    // Allow reset if admin exists and requires initialization
    return adminUser && adminUser.requiresInit
  }

  generateFlowPhrase() {
    try {
      // Generate a 12-word mnemonic
      return generateMnemonic(wordlist)
    } catch (error) {
      console.error('Generate flow phrase error:', error)
      return null
    }
  }

  validateFlowPhrase(phrase) {
    try {
      if (!phrase) return false
      
      // Check if it's a valid BIP39 mnemonic
      return validateMnemonic(phrase, wordlist)
    } catch (error) {
      console.error('Validate flow phrase error:', error)
      return false
    }
  }

  // List all users and bots
  listAllUsers() {
    try {
      const localUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      const submittedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMITTED_USERS) || '[]')
      
      const allUsers = [...localUsers, ...submittedUsers]
      
      // Group users by type
      const users = {
        admins: allUsers.filter(u => u.isAdmin),
        explorers: allUsers.filter(u => u.isExplorer),
        regularUsers: allUsers.filter(u => !u.isAdmin && !u.isExplorer),
        total: allUsers.length
      }

      return users
    } catch (error) {
      console.error('List users error:', error)
      return {
        admins: [],
        explorers: [],
        regularUsers: [],
        total: 0
      }
    }
  }

  // User Authentication
  async authenticateUser(email, password) {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      const user = users.find(u => u.email === email)

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        }
      }

      const passwordHash = this._hashPassword(password)
      if (user.passwordHash !== passwordHash) {
        return {
          success: false,
          error: 'Invalid password'
        }
      }

      // Update last login
      user.security.lastLogin = new Date().toISOString()
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))

      return {
        success: true,
        user: {
          ...user,
          passwordHash: undefined
        }
      }
    } catch (error) {
      console.error('Authentication error:', error)
      return {
        success: false,
        error: 'Authentication failed'
      }
    }
  }

  // Create new user
  async createUser(email, password, displayName) {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      
      if (users.some(u => u.email === email)) {
        return {
          success: false,
          error: 'Email already registered'
        }
      }

      const newUser = {
        id: this._generateId(),
        email,
        passwordHash: this._hashPassword(password),
        displayName: displayName || email.split('@')[0],
        preferences: {
          theme: 'light',
          notifications: true
        },
        progress: {
          level: 'novice',
          xp: 0,
          achievements: [],
          metrics: []
        },
        security: {
          verified: false,
          lastLogin: new Date().toISOString(),
          loginMethod: 'local',
          twoFactorEnabled: false
        },
        roles: {
          permissions: ['USER']
        }
      }

      users.push(newUser)
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))

      return {
        success: true,
        user: {
          ...newUser,
          passwordHash: undefined
        }
      }
    } catch (error) {
      console.error('User creation error:', error)
      return {
        success: false,
        error: 'Failed to create user'
      }
    }
  }

  // Verify admin access
  async verifyAdminAccess(email, secondFactor) {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      const user = users.find(u => u.email === email)

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        }
      }

      // Verify second factor (simplified for demo)
      if (secondFactor !== 'demo-2fa-code') {
        return {
          success: false,
          error: 'Invalid 2FA code'
        }
      }

      // Update user roles
      if (!user.roles.permissions.includes('ADMIN')) {
        user.roles.permissions.push('ADMIN')
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
      }

      return { success: true }
    } catch (error) {
      console.error('Admin verification error:', error)
      return {
        success: false,
        error: 'Admin verification failed'
      }
    }
  }

  _hashPassword(password) {
    // Simplified password hashing for demo purposes
    return CryptoJS.SHA256(password).toString()
  }

  _generateId() {
    // Simplified ID generation for demo purposes
    return Math.floor(Math.random() * 1000000).toString()
  }
}

export const userDb = new UserDb()
