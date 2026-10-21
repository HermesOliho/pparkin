<script setup lang="ts">
import { Form, Head, Link, router } from '@inertiajs/vue3';
import { usePasskeyVerify } from '@laravel/passkeys/vue';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

defineProps<{
    status?: string;
    canResetPassword: boolean;
}>();

defineOptions({
    layout: {
        title: 'Log in to your account',
        description: 'Enter your email and password below to log in',
    },
});

const {
    verify,
    isLoading: isVerifyingPasskey,
    error: passkeyError,
    isSupported: passkeysSupported,
} = usePasskeyVerify({
    onSuccess: (response) => {
        router.visit(response.redirect ?? '/dashboard');
    },
});
</script>

<template>
    <div>
        <Head title="Log in" />

        <p v-if="status" role="status">{{ status }}</p>

        <section v-if="passkeysSupported">
            <button
                type="button"
                :disabled="isVerifyingPasskey"
                @click="verify"
            >
                {{
                    isVerifyingPasskey
                        ? 'Authenticating…'
                        : 'Sign in with a passkey'
                }}
            </button>
            <p v-if="passkeyError" role="alert">{{ passkeyError }}</p>
            <p>Or continue with email</p>
        </section>

        <Form
            v-bind="store.form()"
            :reset-on-success="['password']"
            v-slot="{ errors, processing }"
        >
            <div>
                <label for="email">Email address</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    v-focus
                    :tabindex="1"
                    autocomplete="email"
                    placeholder="email@example.com"
                />
                <p v-if="errors.email" role="alert">{{ errors.email }}</p>
            </div>

            <div>
                <label for="password">Password</label>
                <Link v-if="canResetPassword" :href="request()" :tabindex="5">
                    Forgot your password?
                </Link>
                <input
                    id="password"
                    type="password"
                    name="password"
                    required
                    :tabindex="2"
                    autocomplete="current-password"
                    placeholder="Password"
                />
                <p v-if="errors.password" role="alert">{{ errors.password }}</p>
            </div>

            <div>
                <label for="remember">
                    <input
                        id="remember"
                        type="checkbox"
                        name="remember"
                        :tabindex="3"
                    />
                    Remember me
                </label>
            </div>

            <button
                type="submit"
                :tabindex="4"
                :disabled="processing"
                data-test="login-button"
            >
                {{ processing ? 'Logging in…' : 'Log in' }}
            </button>
        </Form>

        <p>
            Don't have an account?
            <Link :href="register()" :tabindex="5">Sign up</Link>
        </p>
    </div>
</template>
