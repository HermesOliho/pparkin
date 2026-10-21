<script setup lang="ts">
defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <main>
        <h1 v-if="title">{{ title }}</h1>
        <p v-if="description">{{ description }}</p>
        <slot />
    </main>
</template>
