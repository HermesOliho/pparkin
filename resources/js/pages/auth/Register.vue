<script setup lang="ts">
import { Form, Head, Link } from "@inertiajs/vue3";
import { login } from "@/routes";
import { store } from "@/routes/register";
import { ref } from "vue";
import { Eye, EyeClosed, Key, Lock, Mail, User } from "@lucide/vue";

defineProps<{
    passwordRules: string;
}>();

defineOptions({
    layout: {
        title: "Créer un compte",
        description:
            "Remplissez vos informations dans ce formulaire pou₹c réer un compte",
    },
});

const showPassword = ref(false);
const showPasswordConfirmation = ref(false);
</script>

<template>
    <div class="aura text-emerald-300">
        <div class="card text-base-content bg-base-100">
            <div class="card-body max-w-lg" style="width: calc(100dvw - 2rem)">
                <Head title="Register" />

                <Form
                    v-bind="store.form()"
                    :reset-on-success="['password', 'password_confirmation']"
                    v-slot="{ errors, processing }"
                >
                    <div class="flex flex-col gap-3">
                        <div>
                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">
                                    Quel votre nom ?
                                </legend>
                                <label for="name" class="input input-lg w-full">
                                    <User class="w-5 h-5" />
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        v-focus
                                        :tabindex="1"
                                        autocomplete="name"
                                        name="name"
                                        placeholder="Nom complet"
                                    />
                                </label>
                                <p
                                    v-if="errors.name"
                                    role="alert"
                                    class="label text-error"
                                >
                                    {{ errors.name }}
                                </p>
                            </fieldset>
                        </div>

                        <div>
                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">
                                    Adresse mail
                                </legend>
                                <label
                                    for="email"
                                    class="input input-lg w-full"
                                >
                                    <Mail class="w-5 h-5" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        :tabindex="2"
                                        autocomplete="email"
                                        name="email"
                                        placeholder="email@example.com"
                                    />
                                </label>
                                <p
                                    v-if="errors.email"
                                    role="alert"
                                    class="label text-error"
                                >
                                    {{ errors.email }}
                                </p>
                            </fieldset>
                        </div>

                        <div>
                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">
                                    Créez un mot de passe
                                </legend>
                                <label
                                    for="password"
                                    class="input input-lg w-full"
                                >
                                    <Lock class="w-5 h-5" />
                                    <input
                                        id="password"
                                        :type="
                                            showPassword ? 'text' : 'password'
                                        "
                                        required
                                        :tabindex="3"
                                        autocomplete="new-password"
                                        name="password"
                                        placeholder="Mot de passe"
                                        :passwordrules="passwordRules"
                                    />
                                    <button
                                        type="button"
                                        @click="showPassword = !showPassword"
                                    >
                                        <EyeClosed
                                            class="size-4"
                                            v-if="showPassword"
                                        />
                                        <Eye class="size-4" v-else />
                                    </button>
                                </label>
                                <p
                                    v-if="errors.password"
                                    role="alert"
                                    class="label text-error"
                                >
                                    {{ errors.password }}
                                </p>
                            </fieldset>
                        </div>

                        <div>
                            <fieldset class="fieldset">
                                <legend class="fieldset-legend">
                                    Confirmez le mot de passe
                                </legend>
                                <label
                                    for="password_confirmation"
                                    class="input input-lg w-full"
                                >
                                    <Lock class="w-5 h-5" />
                                    <input
                                        id="password_confirmation"
                                        :type="
                                            showPasswordConfirmation
                                                ? 'text'
                                                : 'password'
                                        "
                                        required
                                        :tabindex="4"
                                        autocomplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirmez le mot de passe"
                                        :passwordrules="passwordRules"
                                    />
                                    <button
                                        type="button"
                                        @click="
                                            showPasswordConfirmation =
                                                !showPasswordConfirmation
                                        "
                                    >
                                        <EyeClosed
                                            class="size-4"
                                            v-if="showPasswordConfirmation"
                                        />
                                        <Eye class="size-4" v-else />
                                    </button>
                                </label>
                                <p
                                    v-if="errors.password_confirmation"
                                    role="alert"
                                    class="label text-error"
                                >
                                    {{ errors.password_confirmation }}
                                </p>
                            </fieldset>
                        </div>

                        <button
                            type="submit"
                            tabindex="5"
                            :disabled="processing"
                            data-test="register-user-button"
                            class="btn btn-primary"
                        >
                            {{
                                processing
                                    ? "Création du compte…"
                                    : "Créer un compte"
                            }}
                        </button>
                    </div>
                </Form>

                <div class="divider"></div>

                <p>
                    Vous avez déjà un compte ?
                    <Link
                        :href="login()"
                        :tabindex="6"
                        class="link link-primary font-semibold"
                    >
                        Connectez-vous
                    </Link>
                </p>
            </div>
        </div>
    </div>
</template>
