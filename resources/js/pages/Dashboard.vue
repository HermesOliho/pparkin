<script setup lang="ts">
import { Head, usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);
</script>

<template>
    <div>
        <Head title="Tableau de bord" />

        <h1 class="title">Tableau</h1>
        <p v-if="user">Welcome, {{ user.name }}.</p>
    </div>
</template>
