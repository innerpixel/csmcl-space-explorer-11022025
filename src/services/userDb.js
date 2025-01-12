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
  LOCAL_USERS: 'csmcl_local_users',    // Users created but not submitted
  SUBMITTED_USERS: 'csmcl_submitted',   // Users submitted to backend
  DEFAULT_USERS: 'csmcl_defaults',      // System default users
  EXPLORER_EXPIRY: 'explorer_expiry'    // Explorer session expiry
}

const MAX_USER_LIMIT = 3

// User validation rules
const USER_VALIDATION = {
  cosmicalName: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[A-Za-z0-9._-]+$/,
    message: 'Username must be 3-30 characters and can only contain letters, numbers, dots, underscores, and hyphens'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
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
    cosmicalName: 'CSMCL ADMIN',
    displayName: 'CSMCL Admin',
    email: 'admin-explorer@csmcl.space',
    role: 'admin',
    spaceTheme: 'admin-dark',
    spaceTemplate: 'admin',
    isVerified: true,
    phrase: 'abandon ability able about above absent absorb abstract absurd abuse access accident',
    createdAt: '2025-01-11T12:47:18+02:00'
  },
  {
    cosmicalName: 'CSMCL EXPLORER',
    displayName: 'CSMCL Explorer',
    email: 'explorer@csmcl.space',
    role: 'explorer',
    spaceTheme: 'cosmic-explorer',
    spaceTemplate: 'explorer',
    isVerified: true,
    phrase: 'zebra youth yellow worth window wish winter width wild west wave vault',
    createdAt: '2025-01-11T12:47:18+02:00'
  }
]

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
    // Initialize storages if they don't exist
    if (!localStorage.getItem(STORAGE_KEYS.DEFAULT_USERS)) {
      localStorage.setItem(STORAGE_KEYS.DEFAULT_USERS, JSON.stringify(defaultUsers))
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOCAL_USERS)) {
      localStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify([]))
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBMITTED_USERS)) {
      localStorage.setItem(STORAGE_KEYS.SUBMITTED_USERS, JSON.stringify([]))
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
    const errors = []

    // Validate username
    if (!userData.cosmicalName || 
        userData.cosmicalName.length < USER_VALIDATION.cosmicalName.minLength ||
        userData.cosmicalName.length > USER_VALIDATION.cosmicalName.maxLength ||
        !USER_VALIDATION.cosmicalName.pattern.test(userData.cosmicalName)) {
      errors.push(USER_VALIDATION.cosmicalName.message)
    }

    // Validate email
    if (!userData.email || !USER_VALIDATION.email.pattern.test(userData.email)) {
      errors.push(USER_VALIDATION.email.message)
    }

    // Validate password for new users
    if (!userData.isVerified && (
        !userData.password ||
        userData.password.length < USER_VALIDATION.password.minLength ||
        !USER_VALIDATION.password.pattern.test(userData.password)
    )) {
      errors.push(USER_VALIDATION.password.message)
    }

    // Validate phrase
    if (!userData.phrase || !validateFlowPhrase(userData.phrase)) {
      errors.push(USER_VALIDATION.phrase.message)
    }

    return errors
  }

  // Get all local users
  getLocalUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_USERS) || '[]')
  }

  // Get all submitted users
  getSubmittedUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMITTED_USERS) || '[]')
  }

  // Get default users
  getDefaultUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DEFAULT_USERS) || '[]')
  }

  // Get a specific user by cosmicalName
  getUser(cosmicalName, includeSecrets = false) {
    const searchName = cosmicalName.toUpperCase()
    
    // Check default users first
    const defaultUser = this.getDefaultUsers().find(
      u => u.cosmicalName.toUpperCase() === searchName
    )
    if (defaultUser) {
      if (defaultUser.role === 'explorer') {
        return {
          ...defaultUser,
          explorerExpiry: this.getExplorerExpiry()
        }
      }
      return defaultUser
    }

    // Check local users
    const localUser = this.getLocalUsers().find(
      u => u.cosmicalName.toUpperCase() === searchName
    )
    if (localUser) {
      if (includeSecrets && localUser.phrase && localUser.flowSeed && localUser.salt) {
        return {
          ...localUser,
          phrase: decryptData(localUser.phrase, localUser.salt),
          flowSeed: decryptData(localUser.flowSeed, localUser.salt)
        }
      }
      return localUser
    }

    // Check submitted users
    const submittedUser = this.getSubmittedUsers().find(
      u => u.cosmicalName.toUpperCase() === searchName
    )
    if (submittedUser && includeSecrets && submittedUser.phrase && submittedUser.flowSeed && submittedUser.salt) {
      return {
        ...submittedUser,
        phrase: decryptData(submittedUser.phrase, submittedUser.salt),
        flowSeed: decryptData(submittedUser.flowSeed, submittedUser.salt)
      }
    }
    return submittedUser || null
  }

  // Get user counts
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
    const localUsers = this.getLocalUsers()
    const submittedUsers = this.getSubmittedUsers()
    
    // Check for existing user
    if (this.getUser(userData.cosmicalName)) {
      throw new Error('Username already exists')
    }

    // Check for existing email
    const emailExists = [...localUsers, ...submittedUsers].some(
      u => u.email.toLowerCase() === userData.email.toLowerCase()
    )
    if (emailExists) {
      throw new Error('Email already registered')
    }

    // Generate salt for encryption
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString()
    
    // Create new user with encrypted data
    const newUser = {
      cosmicalName: userData.cosmicalName,
      displayName: userData.displayName,
      email: userData.email,
      password: encryptData(userData.password, salt),
      phrase: encryptData(userData.phrase, salt),
      salt,
      status: 'pending',
      createdAt: new Date().toISOString(),
      isSubmitted: false,
      isVerified: false,
      role: 'user'
    }

    // Save to storage
    localUsers.push(newUser)
    localStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify(localUsers))

    // Return user without sensitive data
    const { password, phrase, salt: _, ...safeUser } = newUser
    return safeUser
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
      localStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify(localUsers))

      // Add to submitted users
      submittedUsers.push(user)
      localStorage.setItem(STORAGE_KEYS.SUBMITTED_USERS, JSON.stringify(submittedUsers))

      return true
    } catch (error) {
      console.error('Failed to submit user:', error)
      throw error
    }
  }

  // Update a user
  updateUser(cosmicalName, updates) {
    // Try updating local user first
    let localUsers = this.getLocalUsers()
    let userIndex = localUsers.findIndex(u => u.cosmicalName === cosmicalName)
    
    if (userIndex !== -1) {
      // Update local user
      localUsers[userIndex] = {
        ...localUsers[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify(localUsers))
      return true
    }

    // Try updating submitted user
    let submittedUsers = this.getSubmittedUsers()
    userIndex = submittedUsers.findIndex(u => u.cosmicalName === cosmicalName)
    
    if (userIndex !== -1) {
      // Update submitted user
      submittedUsers[userIndex] = {
        ...submittedUsers[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEYS.SUBMITTED_USERS, JSON.stringify(submittedUsers))
      return true
    }

    return false
  }

  // Delete a user
  deleteUser(cosmicalName) {
    // Try deleting from local users
    let localUsers = this.getLocalUsers()
    const localIndex = localUsers.findIndex(u => u.cosmicalName === cosmicalName)
    
    if (localIndex !== -1) {
      localUsers.splice(localIndex, 1)
      localStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify(localUsers))
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
}

export const userDb = new UserDb()
