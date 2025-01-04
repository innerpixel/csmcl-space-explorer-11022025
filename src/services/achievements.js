// Internal metrics and XP tracking
export const metrics = {
  documentation: {
    'docs-started': {
      id: 'docs-started',
      xp: 50,
      category: 'documentation',
      type: 'first_view'
    },
    'docs-completed': {
      id: 'docs-completed',
      xp: 100,
      category: 'documentation',
      type: 'completion'
    },
    'quiz-attempt': {
      id: 'quiz-attempt',
      xp: 25,
      category: 'documentation',
      type: 'engagement'
    },
    'quiz-completed': {
      id: 'quiz-completed',
      xp: 75,
      category: 'documentation',
      type: 'completion'
    }
  },
  explorer: {
    'space-setup': {
      id: 'space-setup',
      xp: 150,
      category: 'explorer',
      type: 'completion'
    },
    'network-connect': {
      id: 'network-connect',
      xp: 100,
      category: 'explorer',
      type: 'engagement'
    },
    'feature-discovery': {
      id: 'feature-discovery',
      xp: 50,
      category: 'explorer',
      type: 'engagement'
    }
  }
}

// Experience thresholds
export const xpThresholds = {
  novice: 0,
  intermediate: 500,
  advanced: 1500,
  master: 3000
}

// Metric tracking service
class MetricService {
  constructor() {
    this.metrics = metrics
    this.xpThresholds = xpThresholds
  }

  // Track a metric and return XP earned
  trackMetric(metricId, category, data = {}) {
    const metric = this.metrics[category]?.[metricId]
    if (!metric) return 0

    const timestamp = new Date().toISOString()
    const trackingData = {
      metricId,
      category,
      timestamp,
      ...data
    }

    // Store metric data for later analysis
    this.storeMetricData(trackingData)

    return metric.xp
  }

  // Store metric data (can be expanded to use external analytics)
  storeMetricData(data) {
    const STORAGE_KEY = 'csmcl_metrics'
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const metrics = stored ? JSON.parse(stored) : []
      metrics.push(data)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics))
    } catch (error) {
      console.error('Error storing metric:', error)
    }
  }

  // Calculate level based on XP
  calculateLevel(xp) {
    const levels = Object.entries(this.xpThresholds)
      .sort(([, a], [, b]) => b - a)
    
    return levels.find(([, threshold]) => xp >= threshold)?.[0] || 'novice'
  }

  // Get metrics summary for analysis
  getMetricsSummary() {
    const STORAGE_KEY = 'csmcl_metrics'
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }
}

export const metricService = new MetricService()
