// Role definitions and permissions
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  EXPLORER: 'explorer'
}

// Role-based permissions
export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    canEdit: true,
    canView: true,
    canManageUsers: true,
    canViewMetrics: true,
    canAccessExplorer: true
  },
  [ROLES.USER]: {
    canEdit: false,
    canView: true,
    canManageUsers: false,
    canViewMetrics: true,
    canAccessExplorer: false
  },
  [ROLES.EXPLORER]: {
    canEdit: false,
    canView: true,
    canManageUsers: false,
    canViewMetrics: true,
    canAccessExplorer: true
  }
}

// Special accounts configuration
export const SPECIAL_ACCOUNTS = {
  ADMIN: {
    cosmicalName: 'INNERPIXEL',
    displayName: 'InnerPixel',
    email: 'innerpixel@csmcl.space',
    role: ROLES.ADMIN,
    phrase: 'cosmical space adventure',
    spaceTheme: 'admin-dark',
    spaceTemplate: 'admin'
  },
  EXPLORER: {
    cosmicalName: 'CSMCL.Explorer',
    displayName: 'CSMCL Explorer',
    email: 'explorer@csmcl.space',
    role: ROLES.EXPLORER,
    spaceTheme: 'cosmic-explorer',
    spaceTemplate: 'explorer',
    expirationTime: 10 * 24 * 60 * 60 * 1000  // 10 days in milliseconds
  }
}

// Helper functions for role management
export const hasPermission = (role, permission) => {
  return PERMISSIONS[role]?.[permission] || false
}

export const isAdmin = (role) => role === ROLES.ADMIN
export const isExplorer = (role) => role === ROLES.EXPLORER
export const isUser = (role) => role === ROLES.USER
