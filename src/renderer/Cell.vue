<template>
    <div class="cell" :class="{ 'cell--taken': isCellTaken(x, y), 'cell--selected': isCellSelected(x, y) }"
        @click="handleClickCell(x, y)">
    </div>
</template>

<script lang="ts" setup>
import { useMap } from './composables/map';

defineProps({
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    }
});

const { isCellSelected, isCellTaken, handleClickCell } = useMap();
</script>

<style scoped>
.cell {
    border: 1px solid black;
    aspect-ratio: 1;

    cursor: pointer;

    transition: all 0.5s;
    transform: scale(1);
}

.cell:hover {
    transform: scale(0.9);
}


.cell--taken {
    background: rgb(78, 201, 176);
}

.cell--selected {
    border: 5px solid blue;
}
</style>