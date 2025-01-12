export const ROLES = {
  ADMIN: 'admin',
  EXPLORER: 'explorer',
  USER: 'user'
}

const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 3,
  [ROLES.EXPLORER]: 2,
  [ROLES.USER]: 1
}

export const PERMISSIONS = {
  // Profile Management
  SWITCH_PROFILE: 'switch_profile',
  EDIT_PROFILE: 'edit_profile',
  VIEW_PROFILES: 'view_profiles',
  
  // User Management
  MANAGE_USERS: 'manage_users',
  CREATE_USER: 'create_user',
  DELETE_USER: 'delete_user',
  
  // Space Management
  MANAGE_SPACE: 'manage_space',
  VIEW_SPACE: 'view_space',
  
  // System Features
  ACCESS_ADMIN: 'access_admin',
  ACCESS_EXPLORER: 'access_explorer',
  
  // Security
  MODIFY_SECURITY: 'modify_security',
  VIEW_LOGS: 'view_logs'
}

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.SWITCH_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROFILES,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.MANAGE_SPACE,
    PERMISSIONS.VIEW_SPACE,
    PERMISSIONS.ACCESS_ADMIN,
    PERMISSIONS.ACCESS_EXPLORER,
    PERMISSIONS.MODIFY_SECURITY,
    PERMISSIONS.VIEW_LOGS
  ],
  [ROLES.EXPLORER]: [
    PERMISSIONS.SWITCH_PROFILE,
    PERMISSIONS.VIEW_PROFILES,
    PERMISSIONS.VIEW_SPACE,
    PERMISSIONS.ACCESS_EXPLORER
  ],
  [ROLES.USER]: [
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_SPACE,
    PERMISSIONS.MANAGE_SPACE
  ]
}

export const hasPermission = (role, permission) => 
  ROLE_PERMISSIONS[role]?.includes(permission) || false

export const getRolePermissions = (role) => 
  ROLE_PERMISSIONS[role] || []

export const isProtectedRole = (role) => 
  [ROLES.ADMIN, ROLES.EXPLORER].includes(role)

export const canEditUser = (currentUserRole, targetUserRole) => {
  if (!currentUserRole || !targetUserRole) return false
  return ROLE_HIERARCHY[currentUserRole] > ROLE_HIERARCHY[targetUserRole]
}

export const canSwitchToProfile = (currentUserRole, targetUserRole) => {
  if (!currentUserRole || !targetUserRole) return false
  return currentUserRole === ROLES.ADMIN
}

export const canManageRole = (currentUserRole, targetRole) => {
  if (!currentUserRole || !targetRole) return false
  return ROLE_HIERARCHY[currentUserRole] > ROLE_HIERARCHY[targetRole]
}
