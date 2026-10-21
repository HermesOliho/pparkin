<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { computed, useTemplateRef } from 'vue';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';

const page = usePage();
const user = computed(() => page.props.auth.user);
const passwordInput = useTemplateRef<HTMLInputElement>('passwordInput');
const deleteDetails = useTemplateRef<HTMLDetailsElement>('deleteDetails');

const cancelDelete = (reset: () => void, clearErrors: () => void): void => {
    clearErrors();
    reset();
    deleteDetails.value?.removeAttribute('open');
};
</script>

<template>
    <div>
        <Head title="Profile settings" />

        <h1>Profile settings</h1>

        <section>
            <h2>Profile</h2>
            <p>Update your name and email address</p>

            <Form
                v-bind="ProfileController.update.form()"
                v-slot="{ errors, processing }"
            >
                <div>
                    <label for="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        :value="user.name"
                        required
                        autocomplete="name"
                        placeholder="Full name"
                    />
                    <p v-if="errors.name" role="alert">{{ errors.name }}</p>
                </div>

                <div>
                    <label for="email">Email address</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        :value="user.email"
                        required
                        autocomplete="username"
                        placeholder="Email address"
                    />
                    <p v-if="errors.email" role="alert">{{ errors.email }}</p>
                </div>

                <div
                    v-if="page.props.mustVerifyEmail && !user.email_verified_at"
                >
                    <p>
                        Your email address is unverified.
                        <Link :href="send()" as="button">
                            Click here to re-send the verification email.
                        </Link>
                    </p>

                    <p
                        v-if="page.props.status === 'verification-link-sent'"
                        role="status"
                    >
                        A new verification link has been sent to your email
                        address.
                    </p>
                </div>

                <button
                    type="submit"
                    :disabled="processing"
                    data-test="update-profile-button"
                >
                    {{ processing ? 'Saving…' : 'Save' }}
                </button>
            </Form>
        </section>

        <section>
            <h2>Delete account</h2>
            <p>Delete your account and all of its resources</p>
            <p>
                <strong>Warning</strong>: please proceed with caution, this
                cannot be undone.
            </p>

            <details ref="deleteDetails">
                <summary>Delete account</summary>

                <Form
                    v-bind="ProfileController.destroy.form()"
                    reset-on-success
                    :options="{
                        preserveScroll: true,
                    }"
                    @error="() => passwordInput?.focus()"
                    v-slot="{ errors, processing, reset, clearErrors }"
                >
                    <h3>Are you sure you want to delete your account?</h3>
                    <p>
                        Once your account is deleted, all of its resources and
                        data will also be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </p>

                    <div>
                        <label for="delete-password">Password</label>
                        <input
                            id="delete-password"
                            ref="passwordInput"
                            name="password"
                            type="password"
                            placeholder="Password"
                        />
                        <p v-if="errors.password" role="alert">
                            {{ errors.password }}
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="cancelDelete(reset, clearErrors)"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        :disabled="processing"
                        data-test="confirm-delete-user-button"
                    >
                        {{ processing ? 'Deleting…' : 'Delete account' }}
                    </button>
                </Form>
            </details>
        </section>
    </div>
</template>
