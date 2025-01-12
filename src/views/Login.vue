<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Welcome to CSMCL Space</h2>
      
      <div v-if="!isLoggedIn" class="login-options">
        <div class="mode-selector">
          <button 
            :class="{ active: mode === 'explorer' }" 
            @click="setMode('explorer')"
          >
            Explorer Mode
          </button>
          <button 
            :class="{ active: mode === 'login' }" 
            @click="setMode('login')"
          >
            Sign In
          </button>
          <button 
            :class="{ active: mode === 'register' }" 
            @click="setMode('register')"
          >
            Create Account
          </button>
        </div>

        <!-- Explorer Mode -->
        <div v-if="mode === 'explorer'" class="explorer-mode">
          <p>Start exploring without an account. You can:</p>
          <ul>
            <li>Learn about CSMCL Space</li>
            <li>Interact with demo bots</li>
            <li>Try basic features</li>
          </ul>
          <button @click="startExplorer" class="primary-button">
            Start Exploring
          </button>
        </div>

        <!-- Login Form -->
        <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Email</label>
            <input 
              v-model="loginForm.email" 
              type="email" 
              required
              placeholder="Enter your email"
            >
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input 
              v-model="loginForm.password" 
              type="password" 
              required
              placeholder="Enter your password"
            >
          </div>

          <div class="error-message" v-if="error">
            {{ error }}
          </div>

          <button type="submit" class="primary-button">
            Sign In
          </button>
        </form>

        <!-- Register Form -->
        <form v-if="mode === 'register'" @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label>Email</label>
            <input 
              v-model="registerForm.email" 
              type="email" 
              required
              placeholder="Enter your email"
            >
          </div>

          <div class="form-group">
            <label>Display Name</label>
            <input 
              v-model="registerForm.displayName" 
              type="text" 
              required
              placeholder="Choose a display name"
            >
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input 
              v-model="registerForm.password" 
              type="password" 
              required
              placeholder="Choose a password"
            >
          </div>

          <div class="error-message" v-if="error">
            {{ error }}
          </div>

          <button type="submit" class="primary-button">
            Create Account
          </button>
        </form>
      </div>

      <!-- Logged In State -->
      <div v-else class="logged-in-state">
        <h3>Welcome back, {{ displayName }}!</h3>
        <p>You're already signed in.</p>
        <button @click="goToHome" class="primary-button">
          Go to Home
        </button>
        <button @click="handleLogout" class="secondary-button">
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

export default {
  name: 'LoginView',
  
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    const mode = ref('explorer')
    const error = ref('')
    
    const loginForm = ref({
      email: '',
      password: ''
    })
    
    const registerForm = ref({
      email: '',
      displayName: '',
      password: ''
    })

    const isLoggedIn = computed(() => userStore.isLoggedIn)
    const displayName = computed(() => userStore.displayName)

    const setMode = (newMode) => {
      mode.value = newMode
      error.value = ''
    }

    const startExplorer = async () => {
      try {
        const result = await userStore.startExplorer()
        if (result.success) {
          // Show welcome message
          if (result.message) {
            alert(result.message)
          }
          // Redirect to explorer view
          router.push('/explorer')
        } else {
          error.value = result.error || 'Failed to start explorer mode'
        }
      } catch (err) {
        error.value = err.message || 'An error occurred'
      }
    }

    const handleLogin = async () => {
      try {
        const result = await userStore.login(
          loginForm.value.email,
          loginForm.value.password
        )
        
        if (result.success) {
          router.push('/home')
        } else {
          error.value = result.error || 'Login failed'
        }
      } catch (err) {
        error.value = err.message || 'An error occurred'
      }
    }

    const handleRegister = async () => {
      try {
        const result = await userStore.createUser(
          registerForm.value.email,
          registerForm.value.password,
          registerForm.value.displayName
        )
        
        if (result.success) {
          // Auto-login after registration
          await userStore.login(
            registerForm.value.email,
            registerForm.value.password
          )
          router.push('/home')
        } else {
          error.value = result.error || 'Registration failed'
        }
      } catch (err) {
        error.value = err.message || 'An error occurred'
      }
    }

    const handleLogout = () => {
      userStore.logout()
      router.push('/')
    }

    const goToHome = () => {
      router.push('/home')
    }

    return {
      mode,
      error,
      loginForm,
      registerForm,
      isLoggedIn,
      displayName,
      setMode,
      startExplorer,
      handleLogin,
      handleRegister,
      handleLogout,
      goToHome
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f7fa;
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.mode-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.mode-selector button {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  background: none;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-selector button.active {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.error-message {
  color: #e53e3e;
  margin: 1rem 0;
  font-size: 0.875rem;
}

.primary-button {
  width: 100%;
  padding: 0.75rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.primary-button:hover {
  background: #357abd;
}

.secondary-button {
  width: 100%;
  padding: 0.75rem;
  background: #e0e0e0;
  color: #4a5568;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}

.secondary-button:hover {
  background: #c0c0c0;
}

.explorer-mode {
  text-align: left;
  margin: 1rem 0;
}

.explorer-mode ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.explorer-mode li {
  margin: 0.5rem 0;
  color: #4a5568;
}

.logged-in-state {
  text-align: center;
}

.logged-in-state h3 {
  margin-bottom: 1rem;
  color: #2d3748;
}
</style>
