<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const features = [
  {
    title: 'CSMCL.SPACE.ID',
    description: 'Unique identifier for your Digital Entity in the CSMCL ecosystem',
    icon: '🆔'
  },
  {
    title: 'CSMCL.SPACE SOCIAL',
    description: 'Share as usual but without prying eyes, secure and private',
    icon: '📦'
  },
  {
    title: '  Blockchain Integration',
    description: 'Seamless blockchain integration with Blocto / Flow network',
    icon: '⛓️'
  },
  {
    title: 'Privacy & Security first',
    description: 'Advanced encryption and security measures to protect your data',
    icon: '✅'
  }
]

const quotes = [
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  }
]

const currentQuote = ref(0)

const rotateQuote = () => {
  currentQuote.value = (currentQuote.value + 1) % quotes.length
}

// Rotate quotes every 10 seconds
setInterval(rotateQuote, 10000)
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
            COSMICAL YOU <span class="text-yellow-100">@</span> <span class="text-blue-400">Cosmical.ME</span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            PRIVATE SECURE SOCIAL DIGITAL IMMERSION NETWORK UNIQUE DIGITAL EXPERIENCE INCLUSSIVE ECOSYSTEM
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <router-link
              to="/onboarding/verification"
              class="px-8 py-4 bg-blue-500 text-white rounded-xl font-medium
                     hover:bg-blue-600 transform hover:scale-105 transition-all duration-300
                     shadow-lg shadow-blue-500/25"
            >
              Get Started
            </router-link>
            <router-link
              to="/documentation"
              class="px-8 py-4 bg-gray-800/50 text-white rounded-xl font-medium
                     hover:bg-gray-700/50 transform hover:scale-105 transition-all duration-300
                     border border-gray-700/50"
            >
              Learn More
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h3 class="text-2xl font-bold text-center text-white mb-16">
         PLEASE NOTE!! THIS IS A WORK IN PROGRESS, NOT ALL FEATURES ARE ACTIVE YET 
      </h3>
      <h2  class="text-3xl font-bold text-center text-white mb-16">
        USE <span class="text-blue-400">EXPLORER MODE</span> TO NAVIGATE THE SITE
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50 backdrop-blur-lg
                 hover:bg-gray-800/40 transition-all duration-300
                 transform hover:scale-105"
        >
          <div class="text-4xl mb-4">{{ feature.icon }}</div>
          <h3 class="text-xl font-bold text-white mb-2">{{ feature.title }}</h3>
          <p class="text-gray-400">{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <!-- Quote Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div 
        class="relative rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10
               border border-gray-700/50 backdrop-blur-lg p-12"
      >
        <div class="text-6xl absolute top-8 left-8 opacity-25">"</div>
        <div class="relative">
          <transition
            name="fade"
            mode="out-in"
          >
            <div :key="currentQuote" class="text-center">
              <p class="text-xl md:text-2xl text-white mb-4 italic">
                "{{ quotes[currentQuote].text }}"
              </p>
              <p class="text-gray-400">
                — {{ quotes[currentQuote].author }}
              </p>
            </div>
          </transition>
        </div>
        <div class="text-6xl absolute bottom-8 right-8 opacity-25">"</div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          class="p-8 rounded-xl bg-gray-800/30 border border-gray-700/50 backdrop-blur-lg
                 text-center"
        >
          <div class="text-3xl font-bold text-blue-400 mb-2">Fast & Secure</div>
          <p class="text-gray-400">Advanced encryption for your digital assets</p>
        </div>
        <div 
          class="p-8 rounded-xl bg-gray-800/30 border border-gray-700/50 backdrop-blur-lg
                 text-center"
        >
          <div class="text-3xl font-bold text-blue-400 mb-2">Decentralized</div>
          <p class="text-gray-400">Built on Flow blockchain technology</p>
        </div>
        <div 
          class="p-8 rounded-xl bg-gray-800/30 border border-gray-700/50 backdrop-blur-lg
                 text-center"
        >
          <div class="text-3xl font-bold text-blue-400 mb-2">Scalable</div>
          <p class="text-gray-400">Designed to grow with your needs</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
