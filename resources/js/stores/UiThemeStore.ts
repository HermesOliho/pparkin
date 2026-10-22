import { Moon, Smartphone, Sun } from '@lucide/vue';
import { defineStore } from 'pinia';
import { computed, onScopeDispose, ref, type Component } from 'vue';

export type ThemePreference = 'light' | 'dark' | 'device';

type DaisyTheme = 'emerald' | 'forest';

const STORAGE_KEY = 'pparkin:theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

export const useUiThemeStore = defineStore(
    'ui_theme',
    () => {
        const currentTheme = ref<ThemePreference>('device');
        const appliedTheme = ref<DaisyTheme>('emerald');

        const themes: ThemePreference[] = ['light', 'dark', 'device'];

        const themesIcons: Record<ThemePreference, Component> = {
            light: Sun,
            dark: Moon,
            device: Smartphone,
        };

        const isDark = computed(() => appliedTheme.value === 'forest');

        const resolveTheme = (): DaisyTheme => {
            const prefersDark = window.matchMedia(DARK_QUERY).matches;

            return currentTheme.value === 'dark' ||
                (currentTheme.value === 'device' && prefersDark)
                ? 'forest'
                : 'emerald';
        };

        const applyTheme = (): void => {
            const theme = resolveTheme();

            appliedTheme.value = theme;

            const root = document.documentElement;
            root.dataset.theme = theme;
            root.style.colorScheme = theme === 'forest' ? 'dark' : 'light';
        };

        const selectTheme = (theme: ThemePreference): void => {
            currentTheme.value = theme;
            applyTheme();
        };

        const media = window.matchMedia(DARK_QUERY);

        const handleSystemThemeChange = (): void => {
            if (currentTheme.value === 'device') {
                applyTheme();
            }
        };

        media.addEventListener('change', handleSystemThemeChange);

        onScopeDispose(() => {
            media.removeEventListener('change', handleSystemThemeChange);
        });

        return {
            currentTheme,
            appliedTheme,
            isDark,
            themes,
            themesIcons,
            selectTheme,
            applyTheme,
        };
    },
    {
        persist: {
            key: STORAGE_KEY,
            pick: ['currentTheme'],
        },
    },
);
