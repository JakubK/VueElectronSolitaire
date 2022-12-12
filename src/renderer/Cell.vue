<template>
    <div class="cell">
        {{x}}
        <br/>
        {{y}}
    </div>
</template>

<script lang="ts" setup>
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

</script>

<style scoped>
    .cell {
        border: 1px solid black;
        aspect-ratio: 1;
    }
</style>