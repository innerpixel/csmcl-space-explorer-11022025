<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <li v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
        <div class="flex items-center">
          <span
            v-if="index > 0"
            class="mx-2 text-gray-400"
          >/</span>
          <router-link
            :to="crumb.path"
            :class="[
              'text-sm',
              index === breadcrumbs.length - 1
                ? 'text-gray-200 cursor-default'
                : 'text-gray-400 hover:text-gray-200'
            ]"
          >
            {{ crumb.name }}
          </router-link>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  return route.matched.map(route => ({
    name: route.meta.breadcrumb || route.name,
    path: route.path
  }))
})
</script>
