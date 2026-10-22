<script setup lang="ts">
import AppNavbar from "@/components/AppNavbar.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import { flashMessage } from "@/lib/flash";
import { useUiThemeStore, type ThemePreference } from "@/stores/UiThemeStore";
import { Link, router, usePage } from "@inertiajs/vue3";
import { computed } from "vue";

const page = usePage();
const user = computed(() => page.props.auth.user);

const themeStore = useUiThemeStore();

const handleLogout = () => {
    router.flushAll();
};

const themeLabel = (theme: ThemePreference): string => {
    switch (theme) {
        case "light":
            return "clair";
        case "dark":
            return "sombre";
        default:
            return "selon l'appareil";
    }
};
</script>

<template>
    <div>
        <AppNavbar />

        <p v-if="flashMessage" role="status">{{ flashMessage.message }}</p>

        <main>
            <!-- daisyUI drawer layout -->
            <div class="drawer lg:drawer-open">
                <!-- The drawer toggler -->
                <input
                    id="main-layout-drawer"
                    type="checkbox"
                    class="drawer-toggle"
                />
                <!-- Main content -->
                <div class="drawer-content p-2 bg-base-300/80">
                    <slot></slot>
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
                    <AppSidebar />
                </div>
            </div>
        </main>
    </div>
</template>
