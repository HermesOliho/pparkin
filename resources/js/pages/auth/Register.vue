<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import { login } from '@/routes';
import { store } from '@/routes/register';

defineProps<{
    passwordRules: string;
}>();

defineOptions({
    layout: {
        title: 'Create an account',
        description: 'Enter your details below to create your account',
    },
});
</script>

<template>
    <div>
        <Head title="Register" />

        <Form
            v-bind="store.form()"
            :reset-on-success="['password', 'password_confirmation']"
            v-slot="{ errors, processing }"
        >
            <div>
                <label for="name">Name</label>
                <input
                    id="name"
                    type="text"
                    required
                    v-focus
                    :tabindex="1"
                    autocomplete="name"
                    name="name"
                    placeholder="Full name"
                />
                <p v-if="errors.name" role="alert">{{ errors.name }}</p>
            </div>

            <div>
                <label for="email">Email address</label>
                <input
                    id="email"
                    type="email"
                    required
                    :tabindex="2"
                    autocomplete="email"
                    name="email"
                    placeholder="email@example.com"
                />
                <p v-if="errors.email" role="alert">{{ errors.email }}</p>
            </div>

            <div>
                <label for="password">Password</label>
                <input
                    id="password"
                    type="password"
                    required
                    :tabindex="3"
                    autocomplete="new-password"
                    name="password"
                    placeholder="Password"
                    :passwordrules="passwordRules"
                />
                <p v-if="errors.password" role="alert">{{ errors.password }}</p>
            </div>

            <div>
                <label for="password_confirmation">Confirm password</label>
                <input
                    id="password_confirmation"
                    type="password"
                    required
                    :tabindex="4"
                    autocomplete="new-password"
                    name="password_confirmation"
                    placeholder="Confirm password"
                    :passwordrules="passwordRules"
                />
                <p v-if="errors.password_confirmation" role="alert">
                    {{ errors.password_confirmation }}
                </p>
            </div>

            <button
                type="submit"
                tabindex="5"
                :disabled="processing"
                data-test="register-user-button"
            >
                {{ processing ? 'Creating account…' : 'Create account' }}
            </button>
        </Form>

        <p>
            Already have an account?
            <Link :href="login()" :tabindex="6">Log in</Link>
        </p>
    </div>
</template>
