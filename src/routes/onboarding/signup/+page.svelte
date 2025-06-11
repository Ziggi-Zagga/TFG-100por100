<script lang="ts">
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import { scale } from 'svelte/transition';
	import { fade } from 'svelte/transition';

	const { data } = $props();
	const error = data.error;

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let username = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
</script>

<div
	class="font-inter flex min-h-screen w-full items-center justify-center"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<div
		class="flex w-full max-w-md flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white/90 p-10 shadow-xl"
		in:scale={{ duration: 1500, start: 0.8 }}
	>
		<div class="mx-auto flex h-50 w-50 items-center justify-center rounded text-xs text-gray-600">
			<img src="../logo/logo.png" alt="Logo" class="h-100 w-100 object-contain" />
		</div>
		<div class="text-center">
			<p class="text-sm text-gray-500">Create a new user</p>
		</div>

		<form method="POST" class="space-y-4" autocomplete="off">
			<TextInput
				type="text"
				name="username"
				placeholder="Username"
				required
				bind:value={username}
				extraStyles=""
			/>
			<TextInput
				type="email"
				name="email"
				placeholder="Email address"
				required
				bind:value={email}
				extraStyles=""
			/>

			<div class="relative">
				<TextInput
					type={showPassword ? 'text' : 'password'}
					name="password"
					placeholder="Password"
					required
					bind:value={password}
					extraStyles="pr-10"
				/>

				<button
					type="button"
					class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
					aria-label={showPassword ? 'Hide password' : 'Show password'}
					tabindex="-1"
					onclick={() => (showPassword = !showPassword)}
				>
					{#if showPassword}
						<img src="../icons/visible.png" alt="visible" class="h-4.5 w-5.5" />
					{:else}
						<img src="../icons/hide.png" alt="hide" class="h-5 w-5.5" />
					{/if}
				</button>
			</div>
			<div class="relative">
				<TextInput
					type={showConfirmPassword ? 'text' : 'password'}
					name="confirmPassword"
					placeholder="Confirm password"
					required
					bind:value={confirmPassword}
					extraStyles="pr-10"
				/>
				<button
					type="button"
					class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
					aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
					tabindex="-1"
					onclick={() => (showConfirmPassword = !showConfirmPassword)}
				>
					{#if showConfirmPassword}
						<img src="../icons/visible.png" alt="visible" class="h-4.5 w-5.5" />
					{:else}
						<img src="../icons/hide.png" alt="hide" class="h-5 w-5.5" />
					{/if}
				</button>
			</div>
			{#if error?.message}
				<p class="text-center text-sm text-red-600">{error.message}</p>
			{/if}
			<Button type="submit" variant="primary" size="lg" extraStyles="w-full">Create user</Button>
		</form>
	</div>
</div>
