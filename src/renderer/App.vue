<script setup lang="ts">
window.electron.ipcRenderer.send('message', 'Hello from App.vue!');
</script>

<template>
  <div class="grid">
    <div class="grid__row">
      <div class="grid__corner grid__corner--left"></div>
      <!-- 6 elements -->
      <div class="grid__element" v-for="index in 6" :key="index">{{ index }}</div>
      <div class="grid__corner grid__corner--right"></div>
    </div>
    <div class="grid__row">
      <!-- 21 elements -->
      <div class="grid__element" v-for="index in 21" :key="index">{{ index }}</div>
    </div>
    <div class="grid__row">
      <div class="grid__corner grid__corner--left"></div>
      <!-- 6 elements -->
      <div class="grid__element" v-for="index in 6" :key="index">{{ index }}</div>
      <div class="grid__corner grid__corner--right"></div>
    </div>
  </div>
</template>

<style scoped src="./App.css"/>
