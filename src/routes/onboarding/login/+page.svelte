<script lang="ts">
	import { scale } from 'svelte/transition';
	import TextInput from '$lib/components/utilities/TextInput/TextInput.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	export let form: any;
	let showPassword = false;
	let email = '';
	let password = '';
</script>

<div class="font-inter flex min-h-screen w-full items-center justify-center">
	<div
		class="flex w-full max-w-md flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white/90 p-10 shadow-xl"
		in:scale={{ duration: 1500, start: 0.8 }}
	>
		<div class="mx-auto flex h-50 w-50 items-center justify-center rounded text-xs text-gray-600">
			<img src="../logo/logo.png" alt="Logo" class="h-100 w-100 object-contain" />
		</div>

		<div class="text-center">
			<p class="text-sm text-gray-500">Please sign in to continue</p>
		</div>
		<form method="POST" class="space-y-4" autocomplete="off">
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
					aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
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

			{#if form?.message}
				<p class="text-sm text-red-600">{form.message}</p>
			{/if}

			<Button
				type="submit"
				variant="primary"
				size="lg"
				extraStyles="w-full"
			>
				Sign In
			</Button>
		</form>
	</div>
</div>
