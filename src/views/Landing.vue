<template>
  <div class="h-screen bg-black flex flex-col overflow-hidden">
    <!-- Minimal Top Bar -->
    <div class="h-0.5 bg-emerald-400/40 fixed top-0 left-0 right-0 z-10 shadow-[0_0_15px_rgba(52,211,153,0.5)]">
      <div class="absolute top-0.5 right-2.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 relative">
      <!-- Canvas will be added here later -->
    </div>

    <!-- Bottom Control Panel -->
    <div class="h-12 md:h-[60px] bg-black/90 backdrop-blur-lg border-t border-emerald-400/20 flex justify-around items-center px-5 fixed bottom-0 left-0 right-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.8)]">
      <div class="flex items-center gap-3 group">
        <div class="w-2 h-2 bg-emerald-400 rounded-full opacity-90 shadow-[0_0_10px_rgba(52,211,153,0.8)] group-hover:shadow-[0_0_15px_rgba(52,211,153,1)] transition-all duration-300"></div>
        <span class="text-sm md:text-xs text-emerald-400/90 font-['Press_Start_2P'] group-hover:text-emerald-300 transition-colors duration-300">Connected</span>
      </div>
      <div class="flex items-center gap-3 group">
        <div class="w-2 h-2 bg-emerald-400 rounded-full opacity-90 shadow-[0_0_10px_rgba(52,211,153,0.8)] group-hover:shadow-[0_0_15px_rgba(52,211,153,1)] transition-all duration-300"></div>
        <span class="text-sm md:text-xs text-emerald-400/90 font-['Press_Start_2P'] group-hover:text-emerald-300 transition-colors duration-300">3 Active</span>
      </div>
      <div class="flex items-center gap-3 group">
        <div class="w-2 h-2 bg-emerald-400 rounded-full opacity-90 shadow-[0_0_10px_rgba(52,211,153,0.8)] group-hover:shadow-[0_0_15px_rgba(52,211,153,1)] transition-all duration-300"></div>
        <span class="text-sm md:text-xs text-emerald-400/90 font-['Press_Start_2P'] group-hover:text-emerald-300 transition-colors duration-300">Stable</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Canvas component will be imported here later
</script>

<style scoped>
/* No styles needed, using Tailwind CSS classes */
</style>
