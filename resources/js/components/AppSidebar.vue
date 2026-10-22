<script setup lang="ts">
import { dashboard } from "@/routes";
import { LayoutDashboard } from "@lucide/vue";
</script>

<template>
    <div class="border-base-200 bg-base-200/60 w-72 min-h-full">
        <ul class="menu menu-lg w-full">
            <li>
                <Link :href="dashboard()">
                    <LayoutDashboard :size="20" />
                    Tableau de bord
                </Link>
            </li>
        </ul>
    </div>
</template>
