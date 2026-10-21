<script setup lang="ts">
import { Form, Head, router } from '@inertiajs/vue3';
import { usePasskeyVerify } from '@laravel/passkeys/vue';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import { store } from '@/routes/password/confirm';

defineOptions({
    layout: {
        title: 'Confirm password',
        description:
            'This is a secure area of the application. Please confirm your password before continuing.',
    },
});

const {
    verify,
    isLoading: isVerifyingPasskey,
    error: passkeyError,
    isSupported: passkeysSupported,
} = usePasskeyVerify({
    routes: {
        options: confirmOptions().url,
        submit: confirmStore().url,
    },
    onSuccess: (response) => {
        router.visit(response.redirect ?? '/dashboard');
    },
});
</script>

<template>
    <div>
        <Head title="Confirm password" />

        <section v-if="passkeysSupported">
            <button
                type="button"
                :disabled="isVerifyingPasskey"
                @click="verify"
            >
                {{
                    isVerifyingPasskey ? 'Confirming…' : 'Confirm with passkey'
                }}
            </button>
            <p v-if="passkeyError" role="alert">{{ passkeyError }}</p>
            <p>Or confirm with password</p>
        </section>

        <Form
            v-bind="store.form()"
            reset-on-success
            v-slot="{ errors, processing }"
        >
            <div>
                <label for="password">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    required
                    autocomplete="current-password"
                    autofocus
                />
                <p v-if="errors.password" role="alert">{{ errors.password }}</p>
            </div>

            <button
                type="submit"
                :disabled="processing"
                data-test="confirm-password-button"
            >
                {{ processing ? 'Confirming…' : 'Confirm password' }}
            </button>
        </Form>
    </div>
</template>
