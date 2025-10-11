<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="common-layout">
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container">
        <a class="navbar-brand" href="#"> <i class="fas fa-calculator me-2"></i>成本计算器 </a>
        <span class="navbar-text ms-auto">基于Vue 3的响应式计算工具</span>
      </div>
    </nav>
    <div class="container mt-4">
      <RouterView />
    </div>
  </div>
  <!-- <RouterView /> -->
</template>

<style scoped></style>
