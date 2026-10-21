<script setup lang="ts">
import { Form, Head, setLayoutProps } from '@inertiajs/vue3';
import { computed, ref, watchEffect } from 'vue';
import { store } from '@/routes/two-factor/login';
import type { TwoFactorConfigContent } from '@/types';

const showRecoveryInput = ref<boolean>(false);
const code = ref<string>('');

const authConfigContent = computed<TwoFactorConfigContent>(() => {
    if (showRecoveryInput.value) {
        return {
            title: 'Recovery code',
            description:
                'Please confirm access to your account by entering one of your emergency recovery codes.',
            buttonText: 'login using an authentication code',
        };
    }

    return {
        title: 'Authentication code',
        description:
            'Enter the authentication code provided by your authenticator application.',
        buttonText: 'login using a recovery code',
    };
});

watchEffect(() => {
    setLayoutProps({
        title: authConfigContent.value.title,
        description: authConfigContent.value.description,
    });
});

const toggleRecoveryMode = (clearErrors: () => void): void => {
    showRecoveryInput.value = !showRecoveryInput.value;
    clearErrors();
    code.value = '';
};
</script>

<template>
    <div>
        <Head title="Two-factor authentication" />

        <Form
            v-if="!showRecoveryInput"
            v-bind="store.form()"
            reset-on-error
            @error="code = ''"
            #default="{ errors, processing, clearErrors }"
        >
            <div>
                <label for="code">Authentication code</label>
                <input
                    id="code"
                    v-model="code"
                    name="code"
                    inputmode="numeric"
                    autocomplete="one-time-code"
                    maxlength="6"
                    pattern="[0-9]*"
                    autofocus
                />
                <p v-if="errors.code" role="alert">{{ errors.code }}</p>
            </div>

            <button type="submit" :disabled="processing">Continue</button>

            <p>
                <span>or you can </span>
                <button
                    type="button"
                    @click="() => toggleRecoveryMode(clearErrors)"
                >
                    {{ authConfigContent.buttonText }}
                </button>
            </p>
        </Form>

        <Form
            v-else
            v-bind="store.form()"
            reset-on-error
            #default="{ errors, processing, clearErrors }"
        >
            <div>
                <label for="recovery_code">Recovery code</label>
                <input
                    id="recovery_code"
                    name="recovery_code"
                    type="text"
                    placeholder="Enter recovery code"
                    v-focus
                    required
                />
                <p v-if="errors.recovery_code" role="alert">
                    {{ errors.recovery_code }}
                </p>
            </div>

            <button type="submit" :disabled="processing">Continue</button>

            <p>
                <span>or you can </span>
                <button
                    type="button"
                    @click="() => toggleRecoveryMode(clearErrors)"
                >
                    {{ authConfigContent.buttonText }}
                </button>
            </p>
        </Form>
    </div>
</template>
