import { ref, onMounted, onUnmounted } from 'vue'

export function useActivity() {
  const activities = ref([])
  const loading = ref(true)
  const error = ref(null)
  const refreshInterval = ref(null)

  const fetchActivities = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Simulated API call - replace with actual API
      activities.value = [
        {
          icon: '🚀',
          description: 'System update deployed successfully',
          time: '2 minutes ago',
          status: 'Success',
          type: 'success'
        },
        {
          icon: '⚠️',
          description: 'High network latency detected in EU region',
          time: '15 minutes ago',
          status: 'Warning',
          type: 'warning'
        },
        {
          icon: '🔒',
          description: 'Security audit completed',
          time: '1 hour ago',
          status: 'Completed',
          type: 'success'
        }
      ]
    } catch (e) {
      error.value = 'Failed to load activities: ' + e.message
    } finally {
      loading.value = false
    }
  }

  const startAutoRefresh = (interval = 60000) => {
    stopAutoRefresh()
    refreshInterval.value = setInterval(fetchActivities, interval)
  }

  const stopAutoRefresh = () => {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value)
      refreshInterval.value = null
    }
  }

  onMounted(() => {
    fetchActivities()
    startAutoRefresh()
  })

  onUnmounted(() => {
    stopAutoRefresh()
  })

  return {
    activities,
    loading,
    error,
    fetchActivities,
    startAutoRefresh,
    stopAutoRefresh
  }
}
