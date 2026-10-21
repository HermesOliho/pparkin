<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

defineProps<{
    status?: string;
}>();

defineOptions({
    layout: {
        title: 'Email verification',
        description:
            'Please verify your email address by clicking on the link we just emailed to you.',
    },
});
</script>

<template>
    <div>
        <Head title="Email verification" />

        <p v-if="status === 'verification-link-sent'" role="status">
            A new verification link has been sent to the email address you
            provided during registration.
        </p>

        <Form v-bind="send.form()" v-slot="{ processing }">
            <button type="submit" :disabled="processing">
                {{ processing ? 'Sending…' : 'Resend verification email' }}
            </button>

            <Link :href="logout()" as="button" method="post">Log out</Link>
        </Form>
    </div>
</template>
