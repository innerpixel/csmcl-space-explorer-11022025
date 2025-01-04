import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { achievements, calculateLevel, calculateProgress, getNextLevelRequirement } from '../game/mechanics'

export function useAchievements() {
  const userStore = useUserStore()
  const showAchievementPopup = ref(false)
  const currentAchievement = ref(null)

  const totalXP = computed(() => userStore.achievements.reduce((total, a) => total + a.xp, 0))
  
  const currentLevel = computed(() => calculateLevel(totalXP.value))
  
  const levelProgress = computed(() => calculateProgress(totalXP.value, currentLevel.value))
  
  const nextLevel = computed(() => getNextLevelRequirement(currentLevel.value))

  const earnedAchievements = computed(() => 
    userStore.achievements.map(achievement => ({
      ...achievement,
      details: Object.values(achievements)
        .flatMap(category => category.tasks)
        .find(task => task.id === achievement.id)
    }))
  )

  const availableAchievements = computed(() => 
    Object.entries(achievements).map(([key, category]) => ({
      category: category.category,
      tasks: category.tasks.map(task => ({
        ...task,
        completed: userStore.achievements.some(a => a.id === task.id)
      }))
    }))
  )

  const unlockAchievement = async (achievementId) => {
    const achievement = Object.values(achievements)
      .flatMap(category => category.tasks)
      .find(task => task.id === achievementId)

    if (!achievement) return
    
    if (userStore.achievements.some(a => a.id === achievementId)) return

    currentAchievement.value = achievement
    showAchievementPopup.value = true
    
    await userStore.addAchievement({
      id: achievementId,
      earnedAt: new Date().toISOString(),
      xp: achievement.xp
    })

    // Hide popup after 3 seconds
    setTimeout(() => {
      showAchievementPopup.value = false
      currentAchievement.value = null
    }, 3000)
  }

  return {
    totalXP,
    currentLevel,
    levelProgress,
    nextLevel,
    earnedAchievements,
    availableAchievements,
    unlockAchievement,
    showAchievementPopup,
    currentAchievement
  }
}
