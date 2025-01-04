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

  getUser(cosmicalName) {
    const { users } = this.readDb()
    return users.find(u => u.cosmicalName.toLowerCase() === cosmicalName.toLowerCase())
  }

  createUser(userData) {
    const { users } = this.readDb()
    if (users.some(u => u.cosmicalName.toLowerCase() === userData.cosmicalName.toLowerCase())) {
      return false
    }
    users.push({
      ...userData,
      createdAt: new Date().toISOString()
    })
    return this.writeDb({ users })
  }

  updateUser(cosmicalName, updates) {
    const { users } = this.readDb()
    const userIndex = users.findIndex(u => u.cosmicalName.toLowerCase() === cosmicalName.toLowerCase())
    if (userIndex === -1) return false

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return this.writeDb({ users })
  }

  deleteUser(cosmicalName) {
    const { users } = this.readDb()
    const filteredUsers = users.filter(u => u.cosmicalName.toLowerCase() !== cosmicalName.toLowerCase())
    return this.writeDb({ users: filteredUsers })
  }
}

export const userDb = new UserDb()
