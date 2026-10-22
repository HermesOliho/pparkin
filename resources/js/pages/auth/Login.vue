<script setup lang="ts">
import { Form, Head, Link, router } from "@inertiajs/vue3";
import { usePasskeyVerify } from "@laravel/passkeys/vue";
import { register } from "@/routes";
import { store } from "@/routes/login";
import { request } from "@/routes/password";
import { ref } from "vue";

defineProps<{
    status?: string;
    canResetPassword: boolean;
}>();

defineOptions({
    layout: {
        title: "Connectez-vous à votre compte",
        description:
            "Entrez votre adresse mail et votre mot de passe pour vous connecter",
    },
});

const showPassword = ref(false);

const {
    verify,
    isLoading: isVerifyingPasskey,
    error: passkeyError,
    isSupported: passkeysSupported,
} = usePasskeyVerify({
    onSuccess: (response) => {
        router.visit(response.redirect ?? "/dashboard");
    },
});
</script>

<template>
    <div class="aura text-emerald-300">
        <div class="card bg-base-100 text-base-content">
            <div class="card-body">
                <Head title="Log in" />

                <p v-if="status" role="status">{{ status }}</p>

                <section
                    v-if="passkeysSupported"
                    class="flex justify-center items-center gap-2 flex-col"
                >
                    <button
                        type="button"
                        :disabled="isVerifyingPasskey"
                        @click="verify"
                        class="btn"
                    >
                        {{
                            isVerifyingPasskey
                                ? "Authenticating…"
                                : "Sign in with a passkey"
                        }}
                    </button>
                    <p v-if="passkeyError" role="alert">{{ passkeyError }}</p>
                    <div class="divider">
                        Ou continuez avec une adresse mail
                    </div>
                </section>

                <Form
                    v-bind="store.form()"
                    :reset-on-success="['password']"
                    v-slot="{ errors, processing }"
                >
                    <div class="flex flex-col gap-3">
                        <div>
                            <label for="email" class="input input-lg w-full">
                                Adresse e-mail
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
                            </label>
                            <p v-if="errors.email" role="alert">
                                {{ errors.email }}
                            </p>
                        </div>

                        <div>
                            <label for="password" class="input input-lg w-full">
                                Mot de passe
                                <input
                                    id="password"
                                    :type="showPassword ? 'text' : 'password'"
                                    name="password"
                                    required
                                    :tabindex="2"
                                    autocomplete="current-password"
                                    placeholder="Mot de passe"
                                />
                                <button
                                    type="button"
                                    @click="showPassword = !showPassword"
                                >
                                    {{ showPassword ? "hide" : "show" }}
                                </button>
                            </label>
                            <p v-if="errors.password" role="alert">
                                {{ errors.password }}
                            </p>
                        </div>

                        <div>
                            <label for="remember">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    :tabindex="3"
                                />
                                Se souvenir de moi
                            </label>
                        </div>

                        <button
                            type="submit"
                            :tabindex="4"
                            :disabled="processing"
                            data-test="login-button"
                            class="btn btn-primary"
                        >
                            {{ processing ? "Connexion…" : "Se connecter" }}
                        </button>
                    </div>
                </Form>
                <p class="text-center">
                    <Link
                        v-if="canResetPassword"
                        :href="request()"
                        :tabindex="5"
                        class="link link-secondary"
                    >
                        Mot de passe oublié ?
                    </Link>
                </p>
                <div class="divider"></div>

                <p>
                    Vous n'avez pas encore un compte ?
                    <Link
                        :href="register()"
                        :tabindex="5"
                        class="link link-primary font-semibold"
                    >
                        Inscrivez-vous
                    </Link>
                </p>
            </div>
        </div>
    </div>
</template>
