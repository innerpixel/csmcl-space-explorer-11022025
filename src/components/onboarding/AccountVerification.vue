<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <!-- Progress Indicator -->
    <div class="flex justify-between items-center mb-8">
      <div 
        v-for="(step, index) in verificationSteps" 
        :key="step.id"
        class="flex items-center"
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          :class="[
            currentStep > index 
              ? 'bg-green-500 text-white' 
              : currentStep === index
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-400'
          ]"
        >
          {{ index + 1 }}
        </div>
        <div 
          v-if="index < verificationSteps.length - 1"
          class="w-24 h-0.5 mx-2"
          :class="[
            currentStep > index ? 'bg-green-500' : 'bg-gray-700'
          ]"
        ></div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-8">
      <!-- Cosmical Identity -->
      <div v-if="currentStep === 0" class="space-y-6">
        <h2 class="text-2xl font-bold text-white">Create Your Cosmical Identity</h2>
        <p class="text-gray-400">Choose your temporary Cosmical email and name. You can modify these later during space setup.</p>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Cosmical Email
            </label>
            <div class="flex">
              <input
                v-model="form.cosmicalEmail"
                type="text"
                class="flex-1 bg-gray-900/50 border border-gray-700 rounded-l-lg px-4 py-2 text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="yourname"
              />
              <span class="inline-flex items-center px-4 py-2 bg-gray-800 border border-l-0 border-gray-700 
                         text-gray-400 rounded-r-lg">
                @cosmical.space
              </span>
            </div>
            <p class="mt-1 text-sm text-gray-500">This will be your unique identifier in the CSMCL network</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Display Name
            </label>
            <input
              v-model="form.displayName"
              type="text"
              class="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Display Name"
            />
            <p class="mt-1 text-sm text-gray-500">This is how you'll appear to other users</p>
          </div>
        </div>
      </div>

      <!-- Contact Verification -->
      <div v-if="currentStep === 1" class="space-y-6">
        <h2 class="text-2xl font-bold text-white">Contact Information</h2>
        <p class="text-gray-400">Add your contact details for account verification and security.</p>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              v-model="form.email"
              type="email"
              class="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
            <p class="mt-1 text-sm text-gray-500">For account verification and important updates</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <div class="flex">
              <select
                v-model="form.phoneCountry"
                class="bg-gray-900/50 border border-r-0 border-gray-700 rounded-l-lg px-3 py-2 text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+27">+27</option>
                <!-- Add more country codes as needed -->
              </select>
              <input
                v-model="form.phoneNumber"
                type="tel"
                class="flex-1 bg-gray-900/50 border border-l-0 border-gray-700 rounded-r-lg px-4 py-2 text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Phone Number"
              />
            </div>
            <p class="mt-1 text-sm text-gray-500">For SMS verification and enhanced security</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              SIM Number
            </label>
            <div class="flex">
              <input
                v-model="form.simNumber"
                type="text"
                class="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your SIM card number"
              />
            </div>
            <p class="mt-1 text-sm text-gray-500">Your SIM card's unique identification number (ICCID)</p>
            <button
              @click="showSimHelp = true"
              class="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              How to find your SIM number?
            </button>
          </div>
        </div>
      </div>

      <!-- Review Information -->
      <div v-if="currentStep === 2" class="space-y-6">
        <h2 class="text-2xl font-bold text-white">Review Your Information</h2>
        <p class="text-gray-400">Please verify that all your information is correct.</p>
        
        <div class="space-y-4">
          <div class="bg-gray-900/30 rounded-lg p-4 space-y-3">
            <div>
              <span class="text-sm text-gray-400">Cosmical Email:</span>
              <p class="text-white">{{ form.cosmicalEmail }}@cosmical.space</p>
            </div>
            <div>
              <span class="text-sm text-gray-400">Display Name:</span>
              <p class="text-white">{{ form.displayName }}</p>
            </div>
            <div>
              <span class="text-sm text-gray-400">Contact Email:</span>
              <p class="text-white">{{ form.email }}</p>
            </div>
            <div>
              <span class="text-sm text-gray-400">Phone Number:</span>
              <p class="text-white">{{ form.phoneCountry }} {{ form.phoneNumber }}</p>
            </div>
            <div>
              <span class="text-sm text-gray-400">SIM Number:</span>
              <p class="text-white">{{ form.simNumber }}</p>
            </div>
          </div>

          <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p class="text-sm text-blue-400">
              By proceeding, you agree to our Terms of Service and Privacy Policy. 
              Your information will be securely stored and used only for verification purposes.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between">
      <button
        v-if="currentStep > 0"
        @click="currentStep--"
        class="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700
               transition-colors duration-300"
      >
        Back
      </button>
      <button
        v-if="currentStep < verificationSteps.length - 1"
        @click="nextStep"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
               transition-colors duration-300 ml-auto"
        :disabled="!canProceed"
      >
        Continue
      </button>
      <button
        v-else
        @click="submitVerification"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
               transition-colors duration-300 ml-auto"
        :disabled="!canProceed"
      >
        Submit
      </button>
    </div>

    <!-- SIM Help Modal -->
    <div
      v-if="showSimHelp"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showSimHelp = false"
    >
      <div class="bg-gray-800 rounded-xl p-6 max-w-md mx-4">
        <h3 class="text-lg font-semibold text-white mb-4">Finding Your SIM Number</h3>
        <div class="space-y-4 text-gray-300">
          <p>Your SIM number (ICCID) can be found in several ways:</p>
          <ol class="list-decimal list-inside space-y-2">
            <li>Look at your physical SIM card - it's printed on the card</li>
            <li>On iPhone: Settings > General > About > ICCID</li>
            <li>On Android: Settings > About Phone > Status > ICCID</li>
            <li>Contact your mobile carrier for assistance</li>
          </ol>
          <p class="text-sm text-gray-400 mt-4">
            The SIM number is typically 19-20 digits long and starts with "89"
          </p>
        </div>
        <button
          @click="showSimHelp = false"
          class="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                 transition-colors duration-300 w-full"
        >
          Got it
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()
const showSimHelp = ref(false)

const currentStep = ref(0)
const form = ref({
  cosmicalEmail: '',
  displayName: '',
  email: '',
  phoneCountry: '+1',
  phoneNumber: '',
  simNumber: '',
})

const verificationSteps = [
  { id: 'identity', title: 'Cosmical Identity' },
  { id: 'contact', title: 'Contact Information' },
  { id: 'review', title: 'Review' },
]

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return form.value.cosmicalEmail && form.value.displayName
    case 1:
      return form.value.email && form.value.phoneNumber && form.value.simNumber
    case 2:
      return true
    default:
      return false
  }
})

const nextStep = () => {
  if (canProceed.value && currentStep.value < verificationSteps.length - 1) {
    currentStep.value++
  }
}

const submitVerification = async () => {
  try {
    await userStore.submitVerification({
      cosmicalEmail: `${form.value.cosmicalEmail}@cosmical.space`,
      displayName: form.value.displayName,
      email: form.value.email,
      phone: `${form.value.phoneCountry}${form.value.phoneNumber}`,
      simNumber: form.value.simNumber,
    })
    
    router.push('/onboarding/space')
  } catch (error) {
    console.error('Verification error:', error)
  }
}
</script>
