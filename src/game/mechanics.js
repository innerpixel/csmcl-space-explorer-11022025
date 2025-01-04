// Game mechanics configuration for the onboarding process
export const LEVELS = {
  NOVICE: 'novice',
  EXPLORER: 'explorer',
  PIONEER: 'pioneer',
  COMMANDER: 'commander'
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

export const achievements = {
  identity: {
    category: "Identity",
    tasks: [
      {
        id: "create-profile",
        name: "Identity Creation",
        description: "Create your unique space identity",
        xp: 100,
        reward: "profile-badge"
      },
      {
        id: "verify-email",
        name: "Verified Explorer",
        description: "Verify your email address",
        xp: 150,
        reward: "verification-badge"
      },
      {
        id: "customize-profile",
        name: "Personal Touch",
        description: "Customize your profile appearance",
        xp: 200,
        reward: "customization-tools"
      }
    ]
  },
  exploration: {
    category: "Exploration",
    tasks: [
      {
        id: "visit-dashboard",
        name: "First Steps",
        description: "Visit your space dashboard",
        xp: 50,
        reward: "explorer-tools"
      },
      {
        id: "complete-tutorial",
        name: "Tutorial Master",
        description: "Complete the basic space tutorial",
        xp: 200,
        reward: "tutorial-badge"
      },
      {
        id: "explore-features",
        name: "Feature Explorer",
        description: "Discover all basic space features",
        xp: 300,
        reward: "feature-badge"
      }
    ]
  },
  mastery: {
    category: "Mastery",
    tasks: [
      {
        id: "setup-wallet",
        name: "Wallet Master",
        description: "Set up and secure your space wallet",
        xp: 400,
        reward: "wallet-badge"
      },
      {
        id: "network-pioneer",
        name: "Network Pioneer",
        description: "Establish your first network connection",
        xp: 500,
        reward: "network-badge"
      },
      {
        id: "space-architect",
        name: "Space Architect",
        description: "Customize your space configuration",
        xp: 600,
        reward: "architect-badge"
      }
    ]
  }
}

export const calculateLevel = (xp) => {
  return Object.entries(levelConfig)
    .find(([_, level]) => xp >= level.minXP && xp <= level.maxXP)?.[0] || LEVELS.NOVICE
}

export const calculateProgress = (xp, level) => {
  const config = levelConfig[level]
  const totalXPInLevel = config.maxXP - config.minXP
  const xpInLevel = xp - config.minXP
  return Math.min(100, Math.floor((xpInLevel / totalXPInLevel) * 100))
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
