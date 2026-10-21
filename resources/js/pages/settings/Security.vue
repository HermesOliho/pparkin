<script setup lang="ts">
import { Form, Head, router } from '@inertiajs/vue3';
import { usePasskeyRegister } from '@laravel/passkeys/vue';
import { onUnmounted, ref, watch } from 'vue';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import { destroy } from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyRegistrationController';
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth';
import {
    confirm,
    disable,
    enable,
    regenerateRecoveryCodes,
} from '@/routes/two-factor';
import type { Passkey } from '@/types';

type Props = {
    passwordRules: string;
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
    canManagePasskeys?: boolean;
    passkeys?: Passkey[];
};

const props = withDefaults(defineProps<Props>(), {
    canManageTwoFactor: false,
    requiresConfirmation: false,
    twoFactorEnabled: false,
    canManagePasskeys: false,
    passkeys: () => [],
});

const {
    qrCodeSvg,
    manualSetupKey,
    recoveryCodesList,
    errors: twoFactorErrors,
    hasSetupData,
    clearSetupData,
    clearTwoFactorAuthData,
    fetchSetupData,
    fetchRecoveryCodes,
} = useTwoFactorAuth();

const showSetup = ref(false);
const showVerification = ref(false);
const code = ref('');
const copied = ref(false);
const showRecoveryCodes = ref(false);

watch(showSetup, async (isOpen) => {
    if (!isOpen) {
        showVerification.value = false;
        code.value = '';

        if (!props.twoFactorEnabled) {
            clearSetupData();
        }

        return;
    }

    if (!qrCodeSvg.value) {
        await fetchSetupData();
    }
});

onUnmounted(() => clearTwoFactorAuthData());

const nextSetupStep = (): void => {
    if (props.requiresConfirmation) {
        showVerification.value = true;

        return;
    }

    clearSetupData();
    showSetup.value = false;
};

const copySetupKey = async (): Promise<void> => {
    if (!manualSetupKey.value) {
        return;
    }

    await navigator.clipboard.writeText(manualSetupKey.value);
    copied.value = true;

    window.setTimeout(() => {
        copied.value = false;
    }, 2000);
};

const toggleRecoveryCodes = async (): Promise<void> => {
    if (!showRecoveryCodes.value && !recoveryCodesList.value.length) {
        await fetchRecoveryCodes();
    }

    showRecoveryCodes.value = !showRecoveryCodes.value;
};

const getDefaultPasskeyName = (): string => {
    const userAgent = navigator.userAgent;

    const browser = [
        { pattern: /Edg|Edge/, name: 'Edge' },
        { pattern: /OPR|Opera|OPiOS/, name: 'Opera' },
        { pattern: /Firefox|FxiOS/, name: 'Firefox' },
        { pattern: /Chrome|CriOS/, name: 'Chrome' },
        { pattern: /Safari/, name: 'Safari' },
    ].find(({ pattern }) => pattern.test(userAgent))?.name;

    const operatingSystem = [
        { pattern: /iPhone/, name: 'iPhone' },
        { pattern: /iPad|Macintosh(?=.*Mobile)/, name: 'iPad' },
        { pattern: /Android/, name: 'Android' },
        { pattern: /Mac/, name: 'Mac' },
        { pattern: /Windows/, name: 'Windows' },
    ].find(({ pattern }) => pattern.test(userAgent))?.name;

    return [browser, operatingSystem].filter(Boolean).join(' on ') || '';
};

const passkeyName = ref(getDefaultPasskeyName());
const showPasskeyForm = ref(false);
const deletingPasskeyId = ref<number | null>(null);

const {
    register,
    isLoading: isRegisteringPasskey,
    error: passkeyError,
    isSupported: passkeysSupported,
} = usePasskeyRegister({
    onSuccess: () => {
        passkeyName.value = '';
        showPasskeyForm.value = false;
        router.reload();
    },
});

const handlePasskeySubmit = async (event: Event): Promise<void> => {
    event.preventDefault();

    if (!passkeyName.value.trim()) {
        return;
    }

    await register(passkeyName.value);
};

const cancelPasskeyForm = (): void => {
    showPasskeyForm.value = false;
    passkeyName.value = getDefaultPasskeyName();
};

const removePasskey = (id: number): void => {
    deletingPasskeyId.value = id;

    router.delete(destroy.url(id), {
        preserveScroll: true,
        onError: () => {
            deletingPasskeyId.value = null;
        },
        onSuccess: () => {
            deletingPasskeyId.value = null;
        },
    });
};
</script>

<template>
    <div>
        <Head title="Security settings" />

        <h1>Security settings</h1>

        <section>
            <h2>Update password</h2>
            <p>
                Ensure your account is using a long, random password to stay
                secure
            </p>

            <Form
                v-bind="SecurityController.update.form()"
                :options="{
                    preserveScroll: true,
                }"
                reset-on-success
                :reset-on-error="[
                    'password',
                    'password_confirmation',
                    'current_password',
                ]"
                v-slot="{ errors, processing }"
            >
                <div>
                    <label for="current_password">Current password</label>
                    <input
                        id="current_password"
                        name="current_password"
                        type="password"
                        autocomplete="current-password"
                        placeholder="Current password"
                    />
                    <p v-if="errors.current_password" role="alert">
                        {{ errors.current_password }}
                    </p>
                </div>

                <div>
                    <label for="password">New password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autocomplete="new-password"
                        placeholder="New password"
                        :passwordrules="passwordRules"
                    />
                    <p v-if="errors.password" role="alert">
                        {{ errors.password }}
                    </p>
                </div>

                <div>
                    <label for="password_confirmation">Confirm password</label>
                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
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
                    data-test="update-password-button"
                >
                    {{ processing ? 'Saving…' : 'Save' }}
                </button>
            </Form>
        </section>

        <section v-if="canManageTwoFactor">
            <h2>Two-factor authentication</h2>
            <p>Manage your two-factor authentication settings</p>

            <template v-if="!twoFactorEnabled">
                <p>
                    When you enable two-factor authentication, you will be
                    prompted for a secure pin during login. This pin can be
                    retrieved from a TOTP-supported application on your phone.
                </p>

                <button
                    v-if="hasSetupData"
                    type="button"
                    @click="showSetup = true"
                >
                    Continue setup
                </button>
                <Form
                    v-else
                    v-bind="enable.form()"
                    @success="showSetup = true"
                    #default="{ processing }"
                >
                    <button type="submit" :disabled="processing">
                        {{ processing ? 'Enabling…' : 'Enable 2FA' }}
                    </button>
                </Form>
            </template>

            <template v-else>
                <p>
                    You will be prompted for a secure, random pin during login,
                    which you can retrieve from the TOTP-supported application
                    on your phone.
                </p>

                <Form v-bind="disable.form()" #default="{ processing }">
                    <button type="submit" :disabled="processing">
                        {{ processing ? 'Disabling…' : 'Disable 2FA' }}
                    </button>
                </Form>

                <section>
                    <h3>2FA recovery codes</h3>
                    <p>
                        Recovery codes let you regain access if you lose your
                        2FA device. Store them in a secure password manager.
                    </p>

                    <button type="button" @click="toggleRecoveryCodes">
                        {{ showRecoveryCodes ? 'Hide' : 'View' }}
                        recovery codes
                    </button>

                    <Form
                        v-if="showRecoveryCodes && recoveryCodesList.length"
                        v-bind="regenerateRecoveryCodes.form()"
                        method="post"
                        :options="{ preserveScroll: true }"
                        @success="fetchRecoveryCodes"
                        #default="{ processing }"
                    >
                        <button type="submit" :disabled="processing">
                            {{
                                processing
                                    ? 'Regenerating…'
                                    : 'Regenerate codes'
                            }}
                        </button>
                    </Form>

                    <div v-if="twoFactorErrors.length" role="alert">
                        <p>Something went wrong.</p>
                        <ul>
                            <li
                                v-for="(error, index) in twoFactorErrors"
                                :key="index"
                            >
                                {{ error }}
                            </li>
                        </ul>
                    </div>

                    <ul v-if="showRecoveryCodes">
                        <li
                            v-for="(recoveryCode, index) in recoveryCodesList"
                            :key="index"
                        >
                            {{ recoveryCode }}
                        </li>
                        <li v-if="!recoveryCodesList.length">Loading…</li>
                    </ul>

                    <p>
                        Each recovery code can be used once to access your
                        account and will be removed after use. If you need more,
                        click Regenerate codes above.
                    </p>
                </section>
            </template>

            <section v-if="showSetup">
                <h3>Enable two-factor authentication</h3>

                <template v-if="!showVerification">
                    <p>
                        To finish enabling two-factor authentication, scan the
                        QR code or enter the setup key in your authenticator
                        app.
                    </p>

                    <div v-if="twoFactorErrors.length" role="alert">
                        <p>Something went wrong.</p>
                        <ul>
                            <li
                                v-for="(error, index) in twoFactorErrors"
                                :key="index"
                            >
                                {{ error }}
                            </li>
                        </ul>
                    </div>

                    <template v-else>
                        <div v-if="qrCodeSvg" v-html="qrCodeSvg"></div>
                        <p v-else>Loading QR code…</p>

                        <p v-if="manualSetupKey">
                            Setup key:
                            <code>{{ manualSetupKey }}</code>
                        </p>
                        <p v-else>Loading setup key…</p>

                        <button
                            type="button"
                            :disabled="!manualSetupKey"
                            @click="copySetupKey"
                        >
                            {{ copied ? 'Copied' : 'Copy setup key' }}
                        </button>

                        <button type="button" @click="nextSetupStep">
                            {{ requiresConfirmation ? 'Continue' : 'Close' }}
                        </button>
                    </template>
                </template>

                <template v-else>
                    <p>Enter the 6-digit code from your authenticator app.</p>

                    <Form
                        v-bind="confirm.form()"
                        error-bag="confirmTwoFactorAuthentication"
                        reset-on-error
                        @finish="code = ''"
                        @success="showSetup = false"
                        v-slot="{ errors, processing }"
                    >
                        <div>
                            <label for="two-factor-code">
                                Authentication code
                            </label>
                            <input
                                id="two-factor-code"
                                v-model="code"
                                name="code"
                                inputmode="numeric"
                                autocomplete="one-time-code"
                                maxlength="6"
                                pattern="[0-9]*"
                                required
                            />
                            <p v-if="errors.code" role="alert">
                                {{ errors.code }}
                            </p>
                        </div>

                        <button
                            type="button"
                            :disabled="processing"
                            @click="showVerification = false"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            :disabled="processing || code.length < 6"
                        >
                            Confirm
                        </button>
                    </Form>
                </template>

                <button type="button" @click="showSetup = false">Close</button>
            </section>
        </section>

        <section v-if="canManagePasskeys">
            <h2>Passkeys</h2>
            <p>Manage your passkeys for passwordless sign-in</p>

            <ul v-if="passkeys.length">
                <li v-for="passkey in passkeys" :key="passkey.id">
                    <p>
                        {{ passkey.name }}
                        <span v-if="passkey.authenticator">
                            ({{ passkey.authenticator }})
                        </span>
                    </p>
                    <p>
                        Added {{ passkey.created_at_diff }}
                        <template v-if="passkey.last_used_at_diff">
                            / Last used {{ passkey.last_used_at_diff }}
                        </template>
                    </p>

                    <details>
                        <summary>Remove</summary>
                        <p>
                            Are you sure you want to remove the "{{
                                passkey.name
                            }}" passkey? You will no longer be able to use it to
                            sign in.
                        </p>
                        <button
                            type="button"
                            :disabled="deletingPasskeyId === passkey.id"
                            @click="removePasskey(passkey.id)"
                        >
                            {{
                                deletingPasskeyId === passkey.id
                                    ? 'Removing…'
                                    : 'Remove passkey'
                            }}
                        </button>
                    </details>
                </li>
            </ul>

            <p v-else>
                No passkeys yet. Add a passkey to sign in without a password.
            </p>

            <p v-if="!passkeysSupported">
                Passkeys are not supported in this browser.
            </p>
            <template v-else>
                <button
                    v-if="!showPasskeyForm"
                    type="button"
                    @click="showPasskeyForm = true"
                >
                    Add passkey
                </button>

                <form v-else @submit="handlePasskeySubmit">
                    <div>
                        <label for="passkey-name">Passkey name</label>
                        <input
                            id="passkey-name"
                            v-model="passkeyName"
                            type="text"
                            placeholder="e.g., MacBook Pro, iPhone"
                            v-focus
                        />
                        <p>A name helps you identify this passkey later.</p>
                    </div>

                    <p v-if="passkeyError" role="alert">{{ passkeyError }}</p>

                    <button
                        type="submit"
                        :disabled="isRegisteringPasskey || !passkeyName.trim()"
                    >
                        {{
                            isRegisteringPasskey
                                ? 'Registering…'
                                : 'Register passkey'
                        }}
                    </button>
                    <button type="button" @click="cancelPasskeyForm">
                        Cancel
                    </button>
                </form>
            </template>
        </section>
    </div>
</template>
