<template>
  <div class="dashboard">
    <div class="header">
      <h1>Welcome, {{ displayName }}!</h1>
      <p class="subtitle">Your CSMCL Space Dashboard</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Level</h3>
        <p class="stat-value">{{ userStore.preferences.level }}</p>
      </div>
      <div class="stat-card">
        <h3>XP</h3>
        <p class="stat-value">{{ userStore.preferences.xp || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3>Achievements</h3>
        <p class="stat-value">{{ userStore.preferences.achievements?.length || 0 }}</p>
      </div>
    </div>

    <div class="features-section">
      <h2>Available Features</h2>
      <div class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-card">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <button @click="$router.push('/profile')" class="action-button">
          Edit Profile
        </button>
        <button v-if="!userStore.isAdmin" @click="requestAdminAccess" class="action-button">
          Request Admin Access
        </button>
        <button v-if="userStore.isAdmin" @click="$router.push('/admin')" class="action-button admin">
          Admin Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const displayName = computed(() => userStore.displayName)

const features = [
  {
    title: 'CSMCL.SPACE.ID',
    description: 'Your unique digital identity',
    icon: '🆔'
  },
  {
    title: 'Secure Storage',
    description: 'End-to-end encrypted data storage',
    icon: '🔒'
  },
  {
    title: 'Network',
    description: 'Connect with other CSMCL users',
    icon: '🌐'
  },
  {
    title: 'Analytics',
    description: 'Track your space usage and growth',
    icon: '📊'
  }
]

const requestAdminAccess = async () => {
  const code = prompt('Enter 2FA code for admin access:')
  if (code) {
    const result = await userStore.toggleAdmin(true, code)
    if (result.success) {
      router.push('/admin')
    } else {
      alert(result.error || 'Failed to enable admin access')
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #4a5568;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
}

.features-section {
  margin-bottom: 3rem;
}

.features-section h2 {
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #4a5568;
}

.quick-actions {
  margin-top: 3rem;
}

.quick-actions h2 {
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: #4a90e2;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.action-button:hover {
  background: #357abd;
}

.action-button.admin {
  background: #805ad5;
}

.action-button.admin:hover {
  background: #6b46c1;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
