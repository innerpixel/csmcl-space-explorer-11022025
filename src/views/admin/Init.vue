<template>
  <div class="admin-init-container">
    <div class="admin-init-box">
      <h2>Initialize Admin Account</h2>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="info-box">
        <p>Your recovery phrase is the key to regaining access to your account if needed.</p>
        <p>This 12-word phrase is unique to your account and cannot be changed.</p>
        <p>Keep it safe and secure - you'll need it for future logins and account recovery.</p>
      </div>

      <div v-if="!form.phrase" class="generate-section">
        <button 
          @click="generatePhrase"
          :disabled="loading"
          class="generate-button"
        >
          Generate Recovery Phrase
        </button>
      </div>

      <div v-else class="phrase-display">
        <label>Your Recovery Phrase:</label>
        <div class="phrase-box">
          {{ form.phrase }}
        </div>
        <button 
          @click="copyPhrase"
          class="copy-button"
        >
          {{ copied ? 'Copied!' : 'Copy Phrase' }}
        </button>
      </div>

      <form v-if="form.phrase" @submit.prevent="handleInit" class="init-form">
        <div class="form-group">
          <label for="confirmPhrase">Confirm Recovery Phrase:</label>
          <input 
            type="password" 
            id="confirmPhrase"
            v-model="form.confirmPhrase"
            :disabled="loading"
            required
            placeholder="Paste your recovery phrase here"
          />
        </div>

        <div class="confirmation-checkbox">
          <input 
            type="checkbox" 
            id="confirmed"
            v-model="form.confirmed"
            required
          />
          <label for="confirmed">
            I have safely stored my recovery phrase and understand I cannot recover my account without it
          </label>
        </div>

        <div class="button-group">
          <button 
            type="submit" 
            :disabled="loading || !isValid"
            class="primary-button"
          >
            {{ loading ? 'Initializing...' : 'Initialize Admin' }}
          </button>

          <button 
            type="button"
            @click="resetForm"
            :disabled="loading"
            class="secondary-button"
          >
            Generate New Phrase
          </button>

          <button 
            type="button"
            @click="goBack"
            :disabled="loading"
            class="back-button"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { userDb } from '../../services/userDb'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  phrase: '',
  confirmPhrase: '',
  confirmed: false
})

const loading = ref(false)
const error = ref('')
const copied = ref(false)

const isValid = computed(() => {
  return form.value.phrase && 
         form.value.phrase === form.value.confirmPhrase &&
         form.value.confirmed &&
         userDb.validateFlowPhrase(form.value.phrase)
})

const generatePhrase = () => {
  const newPhrase = userDb.generateFlowPhrase()
  if (newPhrase) {
    form.value.phrase = newPhrase
    form.value.confirmPhrase = ''
    form.value.confirmed = false
  } else {
    error.value = 'Failed to generate recovery phrase'
  }
}

const copyPhrase = async () => {
  try {
    await navigator.clipboard.writeText(form.value.phrase)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Copy error:', err)
    error.value = 'Failed to copy phrase'
  }
}

const resetForm = () => {
  form.value.phrase = ''
  form.value.confirmPhrase = ''
  form.value.confirmed = false
  error.value = ''
}

const handleInit = async () => {
  try {
    error.value = ''
    loading.value = true

    if (!isValid.value) {
      error.value = 'Please confirm your recovery phrase and check the confirmation box'
      return
    }

    const result = await userStore.initializeAdmin(form.value.phrase)
    
    if (result === true) {
      router.push('/')
    } else {
      error.value = 'Admin initialization failed'
    }
  } catch (err) {
    console.error('Init error:', err)
    error.value = 'An error occurred during initialization'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/login')
}
</script>

<style scoped>
.admin-init-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 1rem;
}

.admin-init-box {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 500px;
}

h2 {
  color: #fff;
  text-align: center;
  margin-bottom: 1.5rem;
}

.info-box {
  background: rgba(13, 110, 253, 0.1);
  border: 1px solid rgba(13, 110, 253, 0.2);
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
}

.info-box p {
  color: #fff;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.generate-section {
  text-align: center;
  margin: 2rem 0;
}

.phrase-display {
  margin-bottom: 2rem;
}

.phrase-box {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 5px;
  color: #fff;
  font-family: monospace;
  margin: 0.5rem 0;
  word-wrap: break-word;
  line-height: 1.5;
}

.error-message {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  color: #fff;
  margin-bottom: 0.5rem;
}

input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  transition: border-color 0.3s;
}

input[type="password"]:focus {
  outline: none;
  border-color: #0d6efd;
}

.confirmation-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.confirmation-checkbox input[type="checkbox"] {
  margin-top: 0.25rem;
}

.confirmation-checkbox label {
  color: #fff;
  font-size: 0.9rem;
  line-height: 1.4;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.generate-button {
  background: #0d6efd;
  color: white;
  font-size: 1.1rem;
}

.generate-button:hover:not(:disabled) {
  background: #0b5ed7;
}

.copy-button {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  margin-top: 0.5rem;
}

.copy-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.primary-button {
  background: #0d6efd;
  color: white;
}

.primary-button:hover:not(:disabled) {
  background: #0b5ed7;
}

.secondary-button {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.secondary-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.back-button {
  background: transparent;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.back-button:hover:not(:disabled) {
  background: rgba(220, 53, 69, 0.1);
}
</style>
