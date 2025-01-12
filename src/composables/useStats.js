import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'

const CACHE_DURATION = 30000 // 30 seconds
const statsCache = new Map()

export function useStats(type = 'user') {
  const userStore = useUserStore()
  const stats = ref({})
  const loading = ref(true)
  const error = ref(null)
  const refreshInterval = ref(null)
  const lastFetchTime = ref(null)

  const getCachedStats = () => {
    const cached = statsCache.get(type)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
    return null
  }

  const setCachedStats = (data) => {
    statsCache.set(type, {
      data,
      timestamp: Date.now()
    })
  }

  const fetchStats = async () => {
    // Check cache first
    const cachedData = getCachedStats()
    if (cachedData) {
      stats.value = cachedData
      loading.value = false
      return
    }

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
      
      // Cache the fetched data
      setCachedStats(stats.value)
      lastFetchTime.value = Date.now()
    } catch (e) {
      error.value = 'Failed to load stats: ' + e.message
    } finally {
      loading.value = false
    }
  }

  const prefetchStats = () => {
    // Only prefetch if cache is expired or doesn't exist
    if (!getCachedStats()) {
      fetchStats()
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
    prefetchStats,
    startAutoRefresh,
    stopAutoRefresh,
    lastFetchTime
  }
}
