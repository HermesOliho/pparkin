<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import { login } from '@/routes';
import { email } from '@/routes/password';

defineProps<{
    status?: string;
}>();

defineOptions({
    layout: {
        title: 'Forgot password',
        description: 'Enter your email to receive a password reset link',
    },
});
</script>

<template>
    <div>
        <Head title="Forgot password" />

        <p v-if="status" role="status">{{ status }}</p>

        <Form v-bind="email.form()" v-slot="{ errors, processing }">
            <div>
                <label for="email">Email address</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    autocomplete="off"
                    v-focus
                    placeholder="email@example.com"
                />
                <p v-if="errors.email" role="alert">{{ errors.email }}</p>
            </div>

            <button
                type="submit"
                :disabled="processing"
                data-test="email-password-reset-link-button"
            >
                {{ processing ? 'Sending…' : 'Email password reset link' }}
            </button>
        </Form>

        <p>
            <span>Or, return to</span>
            <Link :href="login()">log in</Link>
        </p>
    </div>
</template>
