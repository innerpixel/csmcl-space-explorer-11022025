<template>
  <div 
    class="absolute inset-0 w-full h-full flex items-center justify-center bg-transparent overflow-hidden touch-none md:relative md:h-full md:min-h-[60vh]"
    @touchstart="handleTouch"
    @touchmove="handleTouch"
    @touchend="handleTouchEnd"
    @click="handleClick"
  >
    <canvas ref="canvasRef" class="w-full h-full block object-cover"></canvas>
    <div class="absolute inset-0 pointer-events-none">
      <div class="scan-line"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const canvasRef = ref(null)
const ctx = ref(null)
let animationFrame = null
const dpr = window.devicePixelRatio || 1

// Core canvas state
const state = ref({
  width: 0,
  height: 0,
  centerX: 0,
  centerY: 0,
  time: 0,
  mousePosition: { x: 0, y: 0 },
  touchActive: false,
  effects: {
    scanLine: {
      x: 0,
      speed: 2,
      direction: 1,
      intensity: 0.4,
      width: 80
    },
    glitch: {
      active: false,
      intensity: 0,
      duration: 0
    }
  },
  dataStreams: [],
  particles: []
})

// Initialize data streams
function initDataStreams() {
  const streams = [
    { type: 'user', color: '#34D399', speed: 1.2, size: 2 },
    { type: 'bot', color: '#A78BFA', speed: 0.8, size: 1.5 },
    { type: 'system', color: '#FCD34D', speed: 1.5, size: 1 }
  ]

  for (let i = 0; i < 50; i++) {
    const stream = streams[Math.floor(Math.random() * streams.length)]
    state.value.dataStreams.push({
      x: Math.random() * state.value.width,
      y: Math.random() * state.value.height,
      speed: stream.speed * (0.5 + Math.random()),
      color: stream.color,
      size: stream.size,
      length: 10 + Math.random() * 20
    })
  }
}

// Draw data streams
function drawDataStreams(ctx) {
  ctx.save()
  
  state.value.dataStreams.forEach(stream => {
    ctx.beginPath()
    ctx.strokeStyle = stream.color
    ctx.lineWidth = stream.size
    ctx.globalAlpha = 0.6
    ctx.moveTo(stream.x, stream.y)
    ctx.lineTo(stream.x, stream.y - stream.length)
    ctx.stroke()
    
    // Move stream down
    stream.y += stream.speed
    if (stream.y > state.value.height + stream.length) {
      stream.y = -stream.length
      stream.x = Math.random() * state.value.width
    }
  })
  
  ctx.restore()
}

// Draw username with cyber effect
function drawUsername(ctx) {
  const username = userStore.username || 'Explorer'
  ctx.save()
  
  // Set up text style
  const fontSize = Math.min(state.value.width / 15, 42)
  ctx.font = `bold ${fontSize}px 'Press Start 2P', monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Draw glow effect
  ctx.shadowColor = '#34D399'
  ctx.shadowBlur = 20 + Math.sin(state.value.time * 2) * 5
  ctx.fillStyle = '#34D399'
  
  // Draw glitch effect
  if (state.value.effects.glitch.active) {
    const offset = Math.random() * state.value.effects.glitch.intensity
    ctx.fillStyle = '#A78BFA'
    ctx.fillText(username, state.value.centerX + offset, state.value.centerY)
    ctx.fillStyle = '#34D399'
    ctx.fillText(username, state.value.centerX - offset, state.value.centerY)
  } else {
    ctx.fillText(username, state.value.centerX, state.value.centerY)
  }
  
  ctx.restore()
}

// Animation loop
function animate() {
  if (!ctx.value || !canvasRef.value) return
  
  // Update state
  state.value.time += 0.016
  state.value.effects.scanLine.x += state.value.effects.scanLine.speed * state.value.effects.scanLine.direction
  
  // Bounce scan line
  if (state.value.effects.scanLine.x > state.value.width - state.value.effects.scanLine.width) {
    state.value.effects.scanLine.direction = -1
  } else if (state.value.effects.scanLine.x < 0) {
    state.value.effects.scanLine.direction = 1
  }
  
  // Clear canvas
  ctx.value.clearRect(0, 0, state.value.width, state.value.height)
  
  // Draw effects
  drawDataStreams(ctx.value)
  drawUsername(ctx.value)
  
  // Request next frame
  animationFrame = requestAnimationFrame(animate)
}

// Initialize canvas
async function initCanvas() {
  await nextTick()
  const canvas = canvasRef.value
  if (!canvas) return
  
  ctx.value = canvas.getContext('2d')
  if (!ctx.value) return
  
  const container = canvas.parentElement
  if (!container) return
  
  const rect = container.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  
  state.value.width = canvas.width
  state.value.height = canvas.height
  state.value.centerX = state.value.width / 2
  state.value.centerY = state.value.height / 2
  
  ctx.value.scale(dpr, dpr)
  initDataStreams()
}

// Event handlers
function handleTouch(e) {
  e.preventDefault()
  state.value.touchActive = true
  
  const touch = e.touches[0]
  const rect = canvasRef.value.getBoundingClientRect()
  state.value.mousePosition.x = (touch.clientX - rect.left) * dpr
  state.value.mousePosition.y = (touch.clientY - rect.top) * dpr
  
  triggerGlitch()
}

function handleTouchEnd() {
  state.value.touchActive = false
}

function handleClick(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  state.value.mousePosition.x = (e.clientX - rect.left) * dpr
  state.value.mousePosition.y = (e.clientY - rect.top) * dpr
  
  triggerGlitch()
}

function triggerGlitch() {
  state.value.effects.glitch.active = true
  state.value.effects.glitch.intensity = 10
  
  setTimeout(() => {
    state.value.effects.glitch.active = false
    state.value.effects.glitch.intensity = 0
  }, 200)
}

// Handle resize
async function handleResize() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  await initCanvas()
  animate()
}

// Cleanup
onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  window.removeEventListener('resize', handleResize)
})

// Initialize
onMounted(async () => {
  await initCanvas()
  animate()
  window.addEventListener('resize', handleResize)
})
</script>

<style scoped>
.scan-line {
  @apply absolute top-0 bottom-0 w-[80px];
  background: linear-gradient(
    to right,
    transparent,
    rgba(52, 211, 153, 0.4) 50%,
    transparent
  );
  animation: scan-horizontal 4s linear infinite;
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.3);
}

@keyframes scan-horizontal {
  0% {
    left: -5%;
    opacity: 0;
  }
  5% {
    opacity: 0.6;
  }
  45% {
    opacity: 0.6;
  }
  50% {
    left: 95%;
    opacity: 0;
  }
  55% {
    opacity: 0.6;
  }
  95% {
    opacity: 0.6;
  }
  100% {
    left: -5%;
    opacity: 0;
  }
}
</style>