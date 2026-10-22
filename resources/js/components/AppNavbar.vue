<script setup lang="ts">
import AppLogo from '@/components/ui/AppLogo.vue';
import { home, logout } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import { useUiThemeStore, type ThemePreference } from '@/stores/UiThemeStore';
import { Link, router, usePage } from '@inertiajs/vue3';
import { LogOut, Menu, ShieldCheck, User } from '@lucide/vue';
import { computed } from 'vue';

const page = usePage();
const user = computed(() => page.props.auth.user);

const themeStore = useUiThemeStore();

const handleLogout = () => {
    router.flushAll();
};

const themeLabel = (theme: ThemePreference): string => {
    switch (theme) {
        case 'light':
            return 'clair';
        case 'dark':
            return 'sombre';
        default:
            return "selon l'appareil";
    }
};
</script>

<template>
    <header class="navbar bg-base-100 shadow-sm border-b border-base-200">
        <div class="flex-none flex gap-1 items-center">
            <!-- Sidebar toggler -->
            <label
                for="main-layout-drawer"
                class="btn btn-square btn-ghost drawer-button lg:hidden"
            >
                <Menu class="size-8" />
            </label>
        </div>
        <div class="flex-1 lg:ps-4">
            <!-- App logo -->
            <Link :href="home()">
                <AppLogo />
            </Link>
        </div>
        <div class="flex-none flex gap-2">
            <!-- ****** Secondary navbar menu ****** -->
            <!-- *** For small screens *** -->
            <!-- Theme picker -->
            <div class="dropdown dropdown-end lg:hidden ms-1">
                <div
                    tabindex="0"
                    role="button"
                    class="btn btn-square btn-ghost rounded-field"
                >
                    <component
                        :is="themeStore.themesIcons[themeStore.currentTheme]"
                        class="size-6"
                    />
                </div>
                <ul
                    tabindex="-1"
                    class="menu dropdown-content w-52 mt-6 p-1 rounded-box bg-base-100 shadow-sm"
                >
                    <li v-for="theme in themeStore.themes" :key="theme">
                        <button
                            type="button"
                            :class="{
                                'menu-active':
                                    themeStore.currentTheme === theme,
                            }"
                            :aria-pressed="themeStore.currentTheme === theme"
                            @click="themeStore.selectTheme(theme)"
                        >
                            <component
                                :is="themeStore.themesIcons[theme]"
                                class="size-6"
                            />
                            {{ themeLabel(theme) }}
                        </button>
                    </li>
                </ul>
            </div>
            <!-- User menu -->
            <div class="dropdown dropdown-end lg:hidden">
                <div
                    tabindex="0"
                    role="button"
                    class="btn btn-ghost btn-square rounded-field"
                >
                    <User class="size-8" />
                </div>
                <ul
                    tabindex="-1"
                    class="menu dropdown-content bg-base-100 rounded-box w-52 mt-4 p-2 shadow-sm"
                >
                    <li>
                        <Link :href="editProfile()">
                            <User class="size-4" />
                            Profil
                        </Link>
                    </li>
                    <li>
                        <Link :href="editSecurity()">
                            <ShieldCheck class="size-4" />
                            Sécurité
                        </Link>
                    </li>
                    <div class="divider my-0"></div>
                    <li>
                        <Link
                            :href="logout()"
                            method="post"
                            as="button"
                            data-test="logout-button"
                            @click="handleLogout"
                            class="text-error"
                        >
                            <LogOut class="size-4" />
                            Se déconnecter
                        </Link>
                    </li>
                </ul>
            </div>
            <!-- *** For large screens *** -->
            <nav class="hidden lg:block">
                <ul class="menu menu-horizontal px-1">
                    <!-- Theme picker -->
                    <li class="dropdown dropdown-end" v-if="user">
                        <div
                            tabindex="0"
                            role="button"
                            class="btn btn-square btn-ghost"
                        >
                            <component
                                :is="
                                    themeStore.themesIcons[
                                        themeStore.currentTheme
                                    ]
                                "
                                class="size-4"
                            />
                        </div>
                        <ul
                            tabindex="-1"
                            class="menu dropdown-content w-52 mt-6 p-1 rounded-box bg-base-100 shadow-sm"
                        >
                            <li v-for="theme in themeStore.themes" :key="theme">
                                <button
                                    type="button"
                                    :class="{
                                        'menu-active':
                                            themeStore.currentTheme === theme,
                                    }"
                                    :aria-pressed="
                                        themeStore.currentTheme === theme
                                    "
                                    @click="themeStore.selectTheme(theme)"
                                >
                                    <component
                                        :is="themeStore.themesIcons[theme]"
                                        class="size-4"
                                    />
                                    {{ themeLabel(theme) }}
                                </button>
                            </li>
                        </ul>
                    </li>
                    <!-- User dropdown -->
                    <li class="dropdown dropdown-end" v-if="user">
                        <div tabindex="0" role="button" class="btn btn-ghost">
                            <User class="size-4" />
                            <span class="font-bold">{{ user.name }}</span>
                        </div>
                        <ul
                            tabindex="-1"
                            class="menu dropdown-content w-52 mt-6 p-1 rounded-box bg-base-100 shadow-sm"
                        >
                            <li>
                                <Link :href="editProfile()">
                                    <User class="size-4" />
                                    Profil
                                </Link>
                            </li>
                            <li>
                                <Link :href="editSecurity()">
                                    <ShieldCheck class="size-4" />
                                    Sécurité
                                </Link>
                            </li>
                            <div class="divider my-0"></div>
                            <li>
                                <Link
                                    :href="logout()"
                                    method="post"
                                    as="button"
                                    data-test="logout-button"
                                    @click="handleLogout"
                                    class="text-error"
                                >
                                    <LogOut class="size-4" />
                                    Se déconnecter
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
</template>
