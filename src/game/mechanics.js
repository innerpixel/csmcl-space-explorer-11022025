// Game mechanics configuration for the onboarding process
export const LEVELS = {
  NOVICE: 'novice',
  EXPLORER: 'explorer',
  PIONEER: 'pioneer',
  COMMANDER: 'commander'
}

export const achievements = {
  // Identity Achievements
  'first-login': {
    id: 'first-login',
    name: 'First Steps',
    description: 'Begin your journey in the Cosmical Space',
    xp: 50,
    category: 'identity',
    icon: '🌟'
  },
  'customize-profile': {
    id: 'customize-profile',
    name: 'Personal Touch',
    description: 'Customize your profile to make it uniquely yours',
    xp: 200,
    category: 'identity',
    icon: '✨'
  },

  // Space Achievements
  'space-architect': {
    id: 'space-architect',
    name: 'Space Architect',
    description: 'Configure your first space environment',
    xp: 300,
    category: 'space',
    icon: '🏗️'
  },
  'theme-master': {
    id: 'theme-master',
    name: 'Theme Master',
    description: 'Personalize your space with a custom theme',
    xp: 150,
    category: 'space',
    icon: '🎨'
  },

  // Network Achievements
  'network-pioneer': {
    id: 'network-pioneer',
    name: 'Network Pioneer',
    description: 'Set up your network preferences',
    xp: 250,
    category: 'network',
    icon: '🌐'
  },
  'network-ambassador': {
    id: 'network-ambassador',
    name: 'Network Ambassador',
    description: 'Make your space publicly accessible',
    xp: 200,
    category: 'network',
    icon: '🤝'
  },
  'space-explorer': {
    id: 'space-explorer',
    name: 'Space Explorer',
    description: 'Enable space discovery to connect with others',
    xp: 150,
    category: 'network',
    icon: '🔭'
  }
}

export const levels = {
  novice: {
    level: 'Novice',
    xpRequired: 0,
    features: ['basic-profile', 'space-setup']
  },
  explorer: {
    level: 'Explorer',
    xpRequired: 500,
    features: ['network-setup', 'theme-customization']
  },
  pioneer: {
    level: 'Pioneer',
    xpRequired: 1000,
    features: ['advanced-networking', 'space-analytics']
  },
  commander: {
    level: 'Commander',
    xpRequired: 2000,
    features: ['custom-domain', 'api-access']
  }
}

export const levelConfig = {
  [LEVELS.NOVICE]: {
    title: "Space Cadet",
    minXP: 0,
    maxXP: 499,
    features: ["basic-navigation", "profile-setup"],
    rewards: {
      badge: "cadet-badge",
      unlocks: ["basic-customization"]
    }
  },
  [LEVELS.EXPLORER]: {
    title: "Space Explorer",
    minXP: 500,
    maxXP: 999,
    features: ["network-tools", "basic-transactions"],
    rewards: {
      badge: "explorer-badge",
      unlocks: ["theme-customization", "basic-networking"]
    }
  },
  [LEVELS.PIONEER]: {
    title: "Space Pioneer",
    minXP: 1000,
    maxXP: 1999,
    features: ["advanced-tools", "community-access"],
    rewards: {
      badge: "pioneer-badge",
      unlocks: ["advanced-customization", "community-features"]
    }
  },
  [LEVELS.COMMANDER]: {
    title: "Space Commander",
    minXP: 2000,
    maxXP: Infinity,
    features: ["admin-tools", "governance-rights"],
    rewards: {
      badge: "commander-badge",
      unlocks: ["space-governance", "admin-panel"]
    }
  }
}

export const calculateLevel = (xp) => {
  const levelEntries = Object.entries(levels)
  for (let i = levelEntries.length - 1; i >= 0; i--) {
    if (xp >= levelEntries[i][1].xpRequired) {
      return levelEntries[i][1]
    }
  }
  return levels.novice
}

export const calculateProgress = (xp) => {
  const currentLevel = calculateLevel(xp)
  const levelEntries = Object.entries(levels)
  const currentLevelIndex = levelEntries.findIndex(([_, level]) => level.level === currentLevel.level)
  
  if (currentLevelIndex === levelEntries.length - 1) {
    return 100 // Max level reached
  }

  const nextLevel = levelEntries[currentLevelIndex + 1][1]
  const xpInCurrentLevel = xp - currentLevel.xpRequired
  const xpRequiredForNextLevel = nextLevel.xpRequired - currentLevel.xpRequired
  
  return Math.min(100, Math.floor((xpInCurrentLevel / xpRequiredForNextLevel) * 100))
}

export const getNextLevel = (xp) => {
  const currentLevel = calculateLevel(xp)
  const levelEntries = Object.entries(levels)
  const currentLevelIndex = levelEntries.findIndex(([_, level]) => level.level === currentLevel.level)
  
  if (currentLevelIndex === levelEntries.length - 1) {
    return null // No next level
  }

  return levelEntries[currentLevelIndex + 1][1]
}

export const checkFeatureUnlock = (feature, xp) => {
  const currentLevel = calculateLevel(xp)
  return currentLevel.features.includes(feature)
}

export const getUnlockedFeatures = (level) => {
  return Object.entries(levelConfig)
    .filter(([key, _]) => {
      const currentLevelIndex = Object.keys(LEVELS).indexOf(level)
      const thisLevelIndex = Object.keys(LEVELS).indexOf(key)
      return thisLevelIndex <= currentLevelIndex
    })
    .flatMap(([_, levelData]) => levelData.features)
}

export const getNextLevelRequirement = (currentLevel) => {
  const levels = Object.keys(LEVELS)
  const currentIndex = levels.indexOf(currentLevel)
  if (currentIndex === levels.length - 1) return null
  
  const nextLevel = levels[currentIndex + 1]
  return {
    level: nextLevel,
    xpRequired: levelConfig[nextLevel].minXP
  }
}
