import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import type { FlashToast } from '@/types/ui';

export const flashMessage = ref<FlashToast | null>(null);

export function initializeFlash(): void {
    router.on('flash', (event) => {
        const flash = (event as CustomEvent).detail?.flash;
        flashMessage.value = (flash?.toast as FlashToast | undefined) ?? null;
    });
}
