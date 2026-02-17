<template>
  <div id="app" class="min-h-screen bg-gray-50 pb-16">
    <router-view />
    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import BottomNavigation from '@/components/BottomNavigation.vue'
</script>