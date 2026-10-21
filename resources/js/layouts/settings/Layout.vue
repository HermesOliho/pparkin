<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

const page = usePage();

const isProfile = computed(() => page.url.startsWith('/settings/profile'));
const isSecurity = computed(() => page.url.startsWith('/settings/security'));
</script>

<template>
    <section>
        <h1>Settings</h1>

        <nav aria-label="Settings">
            <Link
                :href="editProfile()"
                :aria-current="isProfile ? 'page' : undefined"
            >
                Profile
            </Link>
            <Link
                :href="editSecurity()"
                :aria-current="isSecurity ? 'page' : undefined"
            >
                Security
            </Link>
        </nav>

        <slot />
    </section>
</template>
