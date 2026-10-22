<script setup lang="ts">
defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <main
        class="bg-base-200 min-h-dvh flex flex-col items-center justify-center gap-3"
    >
        <h1
            v-if="title"
            class="text-3xl text-center text-primary font-bold mb-3"
        >
            {{ title }}
        </h1>
        <p v-if="description">{{ description }}</p>
        <slot />
    </main>
</template>
