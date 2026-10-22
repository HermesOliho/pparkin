<script setup lang="ts">
import AppLogo from "@/components/ui/AppLogo.vue";
import { flashMessage } from "@/lib/flash";
import { logout } from "@/routes";
import { edit as editProfile } from "@/routes/profile";
import { edit as editSecurity } from "@/routes/security";
import { Link, router, usePage } from "@inertiajs/vue3";
import {
    LogOut,
    Menu,
    Moon,
    ShieldCheck,
    Smartphone,
    Sun,
    User,
} from "@lucide/vue";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);

const handleLogout = () => {
    router.flushAll();
};
</script>

<template>
    <div>
        <header class="navbar bg-base-100 shadow-sm">
            <div class="flex-none flex gap-1 items-center">
                <!-- Sidebar toggler -->
                <label
                    for="main-layout-drawer"
                    class="btn btn-square btn-ghost drawer-button lg:hidden"
                >
                    <Menu class="size-8" />
                </label>
            </div>
            <div class="flex-1">
                <!-- App logo -->
                <Link href="#">
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
                        <Moon class="size-6" />
                    </div>
                    <ul
                        tabindex="-1"
                        class="menu dropdown-content w-52 mt-6 p-1 rounded-box bg-base-100 shadow-sm"
                    >
                        <li>
                            <Link :href="editProfile()">
                                <Sun class="size-4" />
                                Clair
                            </Link>
                        </li>
                        <li>
                            <Link :href="editProfile()">
                                <Moon class="size-4" />
                                Sombre
                            </Link>
                        </li>
                        <li>
                            <Link :href="editSecurity()">
                                <Smartphone class="size-4" />
                                Appareil
                            </Link>
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
                                <Moon class="size-4" />
                            </div>
                            <ul
                                tabindex="-1"
                                class="menu dropdown-content w-52 mt-6 p-1 rounded-box bg-base-100 shadow-sm"
                            >
                                <li>
                                    <Link :href="editProfile()">
                                        <Sun class="size-4" />
                                        Clair
                                    </Link>
                                </li>
                                <li>
                                    <Link :href="editProfile()">
                                        <Moon class="size-4" />
                                        Sombre
                                    </Link>
                                </li>
                                <li>
                                    <Link :href="editSecurity()">
                                        <Smartphone class="size-4" />
                                        Appareil
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <!-- User dropdown -->
                        <li class="dropdown dropdown-end" v-if="user">
                            <div
                                tabindex="0"
                                role="button"
                                class="btn btn-ghost"
                            >
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

        <p v-if="flashMessage" role="status">{{ flashMessage.message }}</p>

        <main>
            <!-- My timer count down -->
            <span class="countdown font-mono text-2xl">
                <span style="--value: 10" aria-live="polite" aria-label="10"
                    >10</span
                >
                h
                <span style="--value: 24" aria-live="polite" aria-label="24"
                    >24</span
                >
                m
                <span style="--value: 59" aria-live="polite" aria-label="59"
                    >59</span
                >
                s
            </span>
            <!-- daisyUI drawer layout -->
            <div class="drawer lg:drawer-open">
                <!-- The drawer toggler -->
                <input
                    id="main-layout-drawer"
                    type="checkbox"
                    class="drawer-toggle"
                />
                <!-- Main content -->
                <div class="drawer-content">
                    <slot />
                </div>
                <!-- Page sidebar -->
                <div class="drawer-side">
                    <!-- Drawer overlay -->
                    <label
                        for="main-layout-drawer"
                        aria-label="close sidebar"
                        class="drawer-overlay"
                    ></label>
                    <!-- Sidebar content -->
                    <ul class="menu min-h-full w-80 bg-base-100 shadow-sm">
                        <li>Tableau de bord</li>
                    </ul>
                </div>
            </div>
        </main>
    </div>
</template>
