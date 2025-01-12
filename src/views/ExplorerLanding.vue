<template>
  <div class="explorer-landing">
    <!-- Minimal Top Bar -->
    <div class="top-bar">
      <div class="status-indicator"></div>
    </div>

    <!-- Main Canvas Area -->
    <div class="canvas-area">
      <ExplorerCanvas />
    </div>

    <!-- Bottom Control Panel -->
    <div class="control-panel">
      <div class="panel-item">
        <div class="indicator"></div>
        <span class="value">Connected</span>
      </div>
      <div class="panel-item">
        <div class="indicator"></div>
        <span class="value">3 Active</span>
      </div>
      <div class="panel-item">
        <div class="indicator"></div>
        <span class="value">Stable</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import ExplorerCanvas from '../components/explorer/ExplorerCanvas.vue'
</script>

<style scoped>
.explorer-landing {
  height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-bar {
  height: 2px;
  background: rgba(120, 255, 200, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.status-indicator {
  position: absolute;
  top: 2px;
  right: 10px;
  width: 4px;
  height: 4px;
  background: rgb(120, 255, 200);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.canvas-area {
  flex: 1;
  position: relative;
}

.control-panel {
  height: 40px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(120, 255, 200, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.panel-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.indicator {
  width: 6px;
  height: 6px;
  background: rgb(120, 255, 200);
  border-radius: 50%;
  opacity: 0.8;
}

.value {
  font-size: 12px;
  color: rgba(120, 255, 200, 0.8);
  font-family: 'Press Start 2P', monospace;
}

@keyframes pulse {
  0% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .control-panel {
    height: 50px;
  }

  .value {
    font-size: 10px;
  }
}
</style>
