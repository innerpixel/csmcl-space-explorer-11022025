const STORAGE_KEY = 'csmcl_users'
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
    createdAt: '2025-01-11T12:47:18+02:00'
  }
]

class UserDb {
  constructor() {
    this.initDb()
  }

  initDb() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.writeDb({ users: defaultUsers })
    }
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

    return errors
  }

  readDb() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : { users: [] }
    } catch (error) {
      console.error('Error reading database:', error)
      return { users: [] }
    }
  }

  writeDb(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Error writing to database:', error)
      return false
    }
  }

  getUser(cosmicalName) {
    const { users } = this.readDb()
    return users.find(u => u.cosmicalName.toLowerCase() === cosmicalName.toLowerCase())
  }

  getUserCount() {
    const { users } = this.readDb()
    return {
      total: users.length,
      custom: users.filter(u => !defaultUsers.some(du => du.cosmicalName === u.cosmicalName)).length,
      remaining: MAX_USER_LIMIT - users.filter(u => !defaultUsers.some(du => du.cosmicalName === u.cosmicalName)).length
    }
  }

  createUser(userData) {
    // Validate user data
    const validationErrors = this.validateUser(userData)
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`)
    }

    const { users } = this.readDb()
    
    // Check for duplicate username
    if (users.some(u => u.cosmicalName.toLowerCase() === userData.cosmicalName.toLowerCase())) {
      throw new Error('Username already exists')
    }

    // Check for duplicate email
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('Email already registered')
    }

    // Count non-default users
    const nonDefaultUsers = users.filter(u => 
      !defaultUsers.some(du => du.cosmicalName === u.cosmicalName)
    )

    // Check user limit
    if (nonDefaultUsers.length >= MAX_USER_LIMIT) {
      throw new Error(`Maximum limit of ${MAX_USER_LIMIT} users reached`)
    }

    // Create new user with default values
    const newUser = {
      ...userData,
      role: 'user',
      spaceTheme: 'default',
      spaceTemplate: 'user',
      isVerified: false,
      createdAt: new Date().toISOString(),
      metrics: [],
      achievements: [],
      xp: 0,
      level: 'novice'
    }

    users.push(newUser)
    return this.writeDb({ users }) ? newUser : false
  }

  updateUser(cosmicalName, updates) {
    const { users } = this.readDb()
    const userIndex = users.findIndex(u => u.cosmicalName.toLowerCase() === cosmicalName.toLowerCase())
    if (userIndex === -1) return false

    // Don't allow updating critical fields of default users
    const isDefaultUser = defaultUsers.some(du => du.cosmicalName === users[userIndex].cosmicalName)
    if (isDefaultUser) {
      delete updates.role
      delete updates.cosmicalName
      delete updates.email
      delete updates.isVerified
    }

    // Validate updates
    if (updates.email || updates.cosmicalName) {
      const validationErrors = this.validateUser({ ...users[userIndex], ...updates })
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`)
      }
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return this.writeDb({ users })
  }

  deleteUser(cosmicalName) {
    const { users } = this.readDb()
    
    // Prevent deleting default users
    if (defaultUsers.some(du => du.cosmicalName === cosmicalName)) {
      throw new Error('Cannot delete default user')
    }

    const filteredUsers = users.filter(u => u.cosmicalName.toLowerCase() !== cosmicalName.toLowerCase())
    return this.writeDb({ users: filteredUsers })
  }
}

export const userDb = new UserDb()
