import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { achievements, calculateLevel, calculateProgress, getNextLevel } from '../game/mechanics'

const activeNotification = ref(null)

export function useAchievements() {
  const userStore = useUserStore()

  const totalXP = computed(() => {
    if (!userStore.achievements?.length) return 0
    return userStore.achievements.reduce((total, achievement) => {
      return total + (achievements[achievement.id]?.xp || 0)
    }, 0)
  })

  const currentLevel = computed(() => {
    return calculateLevel(totalXP.value || 0).level
  })

  const levelProgress = computed(() => {
    return calculateProgress(totalXP.value || 0)
  })

  const nextLevel = computed(() => {
    return getNextLevel(totalXP.value || 0)
  })

  const earnedAchievements = computed(() => {
    if (!userStore.achievements?.length) return []
    return userStore.achievements.map(achievement => ({
      ...achievements[achievement.id],
      earnedAt: achievement.earnedAt
    }))
  })

  const availableAchievements = computed(() => {
    const earned = new Set(userStore.achievements?.map(a => a.id) || [])
    return Object.values(achievements).filter(a => !earned.has(a.id))
  })

  const unlockAchievement = async (achievementId) => {
    // Check if achievement exists and hasn't been earned
    const achievement = achievements[achievementId]
    if (!achievement || userStore.achievements?.some(a => a.id === achievementId)) {
      return false
    }

    // Add achievement to user's earned achievements
    await userStore.addAchievement({
      id: achievementId,
      earnedAt: new Date().toISOString()
    })

    // Show notification
    activeNotification.value = {
      title: `Achievement Unlocked: ${achievement.title}`,
      description: achievement.description,
      xp: achievement.xp
    }

    // Clear notification after delay
    setTimeout(() => {
      activeNotification.value = null
    }, 5000)

    return true
  }

  const dismissNotification = () => {
    activeNotification.value = null
  }

  return {
    totalXP,
    currentLevel,
    levelProgress,
    nextLevel,
    earnedAchievements,
    availableAchievements,
    unlockAchievement,
    activeNotification,
    dismissNotification
  }
}
