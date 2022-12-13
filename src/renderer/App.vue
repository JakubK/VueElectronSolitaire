<template>
  isWon: {{ isWon }}
  <br/>
  isLost: {{ isLost }}
  <button :disabled="isUndoStackEmpty" @click="undo">Undo</button>
  <button :disabled="isUndoStackEmpty" @click="resetMap" >Reset game</button>
  <div class="grid">
    <div class="grid__row">
      <div class="grid__corner grid__corner--left"></div>
      <!-- 6 elements -->
      <Cell v-for="index in 3"
        :key="index"
        :x="index + 2"
        :y="1"/>
      <Cell v-for="index in 3"
        :key="index"
        :x="index + 2"
        :y="2"/>
      <div class="grid__corner grid__corner--right"></div>
    </div>
    <div class="grid__row">
      <!-- 21 elements -->
      <Cell v-for="index in 7"
        :key="index"
        :x="index"
        :y="3"/>
      <Cell v-for="index in 7"
        :key="index"
        :x="index"
        :y="4"/>
      <Cell v-for="index in 7"
        :key="index"
        :x="index"
        :y="5"/>
    </div>
    <div class="grid__row">
      <div class="grid__corner grid__corner--left"></div>
      <!-- 6 elements -->
      <Cell v-for="index in 3"
        :key="index"
        :x="index + 2"
        :y="6"/>
      <Cell v-for="index in 3"
        :key="index"
        :x="index + 2"
        :y="7"/>
      <div class="grid__corner grid__corner--right"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Cell from './Cell.vue';
import { useMap } from './composables/map';
const { isLost, isWon, resetMap, undo, isUndoStackEmpty } = useMap();
resetMap();

</script>

<style scoped src="./App.css"/>
