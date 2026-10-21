<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import { update } from '@/routes/password';

const props = defineProps<{
    token: string;
    email: string;
    passwordRules: string;
}>();

const inputEmail = ref(props.email);

defineOptions({
    layout: {
        title: 'Reset password',
        description: 'Please enter your new password below',
    },
});
</script>

<template>
    <div>
        <Head title="Reset password" />

        <Form
            v-bind="update.form()"
            :transform="
                (data) => ({ ...data, token: props.token, email: props.email })
            "
            :reset-on-success="['password', 'password_confirmation']"
            v-slot="{ errors, processing }"
        >
            <div>
                <label for="email">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    autocomplete="email"
                    v-model="inputEmail"
                    readonly
                />
                <p v-if="errors.email" role="alert">{{ errors.email }}</p>
            </div>

            <div>
                <label for="password">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    autocomplete="new-password"
                    autofocus
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
                    name="password_confirmation"
                    autocomplete="new-password"
                    placeholder="Confirm password"
                    :passwordrules="passwordRules"
                />
                <p v-if="errors.password_confirmation" role="alert">
                    {{ errors.password_confirmation }}
                </p>
            </div>

            <button
                type="submit"
                :disabled="processing"
                data-test="reset-password-button"
            >
                {{ processing ? 'Resetting…' : 'Reset password' }}
            </button>
        </Form>
    </div>
</template>
