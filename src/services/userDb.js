const STORAGE_KEY = 'csmcl_users'

const defaultUsers = [
  {
    cosmicalName: 'INNERPIXEL',
    displayName: 'InnerPixel',
    email: 'innerpixel@csmcl.space',
    role: 'admin',
    spaceTheme: 'admin-dark',
    spaceTemplate: 'admin',
    isVerified: true,
    createdAt: '2025-01-04T18:43:21+02:00'
  },
  {
    cosmicalName: 'CSMCL.Explorer',
    displayName: 'CSMCL Explorer',
    email: 'explorer@csmcl.space',
    role: 'explorer',
    spaceTheme: 'cosmic-explorer',
    spaceTemplate: 'explorer',
    isVerified: true,
    createdAt: '2025-01-04T18:43:21+02:00'
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

  findUser(cosmicalName) {
    const db = this.readDb()
    return db.users.find(user => 
      user.cosmicalName.toLowerCase() === cosmicalName.toLowerCase()
    )
  }

  createUser(userData) {
    const db = this.readDb()
    
    // Check if user already exists
    if (this.findUser(userData.cosmicalName)) {
      throw new Error('User already exists')
    }

    // Add timestamps
    userData.createdAt = new Date().toISOString()
    userData.updatedAt = new Date().toISOString()

    // Add to database
    db.users.push(userData)
    return this.writeDb(db)
  }

  updateUser(cosmicalName, updates) {
    const db = this.readDb()
    const userIndex = db.users.findIndex(user => 
      user.cosmicalName.toLowerCase() === cosmicalName.toLowerCase()
    )

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    // Update user data
    db.users[userIndex] = {
      ...db.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    return this.writeDb(db)
  }

  deleteUser(cosmicalName) {
    const db = this.readDb()
    const userIndex = db.users.findIndex(user => 
      user.cosmicalName.toLowerCase() === cosmicalName.toLowerCase()
    )

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    db.users.splice(userIndex, 1)
    return this.writeDb(db)
  }

  listUsers() {
    const db = this.readDb()
    return db.users
  }
}

export const userDb = new UserDb()
