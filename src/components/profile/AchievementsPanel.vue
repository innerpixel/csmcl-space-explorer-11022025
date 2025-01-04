<template>
  <div class="space-y-6">
    <!-- Level Progress -->
    <div class="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-xl font-bold text-white">{{ currentLevel }}</h3>
          <p class="text-gray-400">{{ totalXP }} XP</p>
        </div>
        <div v-if="nextLevel" class="text-right">
          <p class="text-sm text-gray-400">Next Level:</p>
          <p class="text-white">{{ nextLevel.level }}</p>
          <p class="text-sm text-gray-500">{{ nextLevel.xpRequired - totalXP }} XP needed</p>
        </div>
      </div>
      <div class="w-full bg-gray-700/30 rounded-full h-2">
        <div class="bg-blue-500 h-2 rounded-full transition-all duration-500"
             :style="{ width: `${levelProgress}%` }"></div>
      </div>
    </div>

    <!-- Badges -->
    <div class="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
      <h3 class="text-lg font-semibold text-white mb-4">Earned Badges</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div v-for="badge in earnedBadges" :key="badge"
             class="aspect-square rounded-lg bg-gray-700/50 p-4 flex items-center justify-center">
          <div class="text-3xl">{{ getBadgeEmoji(badge) }}</div>
        </div>
      </div>
    </div>

    <!-- Achievements List -->
    <div class="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
      <h3 class="text-lg font-semibold text-white mb-4">Achievements</h3>
      <div class="space-y-6">
        <div v-for="category in availableAchievements" :key="category.category" class="space-y-4">
          <h4 class="text-gray-400 font-medium">{{ category.category }}</h4>
          <div class="space-y-3">
            <div v-for="task in category.tasks" :key="task.id"
                 class="flex items-center justify-between p-3 rounded-lg"
                 :class="task.completed ? 'bg-green-900/20' : 'bg-gray-800/50'">
              <div>
                <p class="text-white font-medium">{{ task.name }}</p>
                <p class="text-sm text-gray-400">{{ task.description }}</p>
              </div>
              <div class="text-right">
                <p class="text-yellow-500">+{{ task.xp }} XP</p>
                <p class="text-sm" 
                   :class="task.completed ? 'text-green-400' : 'text-gray-500'">
                  {{ task.completed ? 'Completed' : 'Incomplete' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Achievement Popup -->
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="showAchievementPopup && currentAchievement"
         class="fixed bottom-4 right-4 max-w-sm w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4">
      <div class="flex items-center">
        <div class="flex-shrink-0 text-3xl mr-4">🏆</div>
        <div>
          <p class="font-semibold text-white">Achievement Unlocked!</p>
          <p class="text-gray-300">{{ currentAchievement.name }}</p>
          <p class="text-yellow-500">+{{ currentAchievement.xp }} XP</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useAchievements } from '../../composables/useAchievements'

const {
  totalXP,
  currentLevel,
  levelProgress,
  nextLevel,
  earnedBadges,
  availableAchievements,
  showAchievementPopup,
  currentAchievement
} = useAchievements()

const getBadgeEmoji = (badge) => {
  const emojiMap = {
    'cadet-badge': '🎖️',
    'explorer-badge': '🚀',
    'pioneer-badge': '🌟',
    'commander-badge': '⭐',
    'profile-badge': '👤',
    'verification-badge': '✅',
    'tutorial-badge': '📚',
    'feature-badge': '🎯',
    'wallet-badge': '💰',
    'network-badge': '🌐',
    'architect-badge': '🏗️'
  }
  return emojiMap[badge] || '🏅'
}
</script>
