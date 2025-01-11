import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'

export function useStats(type = 'user') {
  const userStore = useUserStore()
  const stats = ref({})
  const loading = ref(true)
  const error = ref(null)
  const refreshInterval = ref(null)

  const fetchStats = async () => {
    loading.value = true
    error.value = null
    
    try {
      if (type === 'user') {
        stats.value = {
          spaceActivity: userStore.spaceActivity,
          networkStats: userStore.networkStats,
          transactionStats: userStore.transactionStats
        }
      } else if (type === 'admin') {
        stats.value = {
          systemHealth: {
            uptime: '99.99%',
            latency: '45ms',
            errors: '0'
          },
          activeUsers: {
            total: '1,234',
            online: '456',
            new: '+23'
          },
          networkLoad: {
            bandwidth: '78%',
            requests: '23k/s',
            queue: '12'
          }
        }
      }
    } catch (e) {
      error.value = 'Failed to load stats: ' + e.message
    } finally {
      loading.value = false
    }
  }

  const startAutoRefresh = (interval = 30000) => {
    stopAutoRefresh()
    refreshInterval.value = setInterval(fetchStats, interval)
  }

  const stopAutoRefresh = () => {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value)
      refreshInterval.value = null
    }
  }

  onMounted(() => {
    fetchStats()
    startAutoRefresh()
  })

  onUnmounted(() => {
    stopAutoRefresh()
  })

  return {
    stats,
    loading,
    error,
    fetchStats,
    startAutoRefresh,
    stopAutoRefresh
  }
}
