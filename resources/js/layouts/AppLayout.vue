<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { flashMessage } from '@/lib/flash';
import { dashboard, logout } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

const page = usePage();
const user = computed(() => page.props.auth.user);

const handleLogout = () => {
    router.flushAll();
};
</script>

<template>
    <div>
        <header>
            <nav>
                <Link :href="dashboard()">Dashboard</Link>
                <Link :href="editProfile()">Profile</Link>
                <Link :href="editSecurity()">Security</Link>
                <span v-if="user">{{ user.name }} ({{ user.email }})</span>
                <Link
                    :href="logout()"
                    method="post"
                    as="button"
                    data-test="logout-button"
                    @click="handleLogout"
                >
                    Log out
                </Link>
            </nav>
        </header>

        <p v-if="flashMessage" role="status">{{ flashMessage.message }}</p>

        <main>
            <slot />
        </main>
    </div>
</template>
