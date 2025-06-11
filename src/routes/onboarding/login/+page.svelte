<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';

	const { form } = $props<{ 
		form?: { 
			error?: { 
				message: string; 
				field?: string 
			};
			success?: boolean;
			redirect?: string;
		} 
	}>();

	let identifier = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let formError = $state('');
	let errorField = $state('');

	// Handle initial page load with errors
	$effect(() => {
		if (form?.error) {
			formError = form.error.message || 'Invalid credentials';
			errorField = form.error.field || '';
		} else if (form?.success && form?.redirect) {
			window.location.href = form.redirect;
		}
	});

	// Handle form submission
	function handleSubmit() {
		formError = '';
		errorField = '';
		
		return async ({ result }: { 
			result: { 
				type: string; 
				data?: { 
					success?: boolean;
					redirect?: string;
					error?: { message: string; field?: string } 
				} 
			} 
		}) => {
			if (result.type === 'success' && result.data?.success && result.data.redirect) {
				window.location.href = result.data.redirect;
			} else if (result.type === 'failure' || result.data?.error) {
				formError = result.data?.error?.message || 'Invalid credentials';
				errorField = result.data?.error?.field || '';
			}
		};
	}
</script>

<div class="font-inter flex min-h-screen w-full items-center justify-center">
	<div
		class="flex w-full max-w-md flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white/90 p-10 shadow-xl"
		in:scale={{ duration: 1500, start: 0.8 }}
	>
		<div class="mx-auto flex h-50 w-50 items-center justify-center rounded text-xs text-gray-600">
			<img src="../logo/logo.png" alt="Logo" class="h-100 w-100 object-contain" />
		</div>

		<form 
			method="POST" 
			class="space-y-4" 
			autocomplete="off"
			use:enhance={handleSubmit}
		>
		<TextInput
			type="text"
			name="identifier"
			placeholder="Email address or username"
			required
			bind:value={identifier}			
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
					tabIndex={-1}
					onclick={() => (showPassword = !showPassword)}
				>
					{#if showPassword}
						<img src="../icons/visible.png" alt="visible" class="h-4.5 w-5.5" />
					{:else}
						<img src="../icons/hide.png" alt="hide" class="h-5 w-5.5" />
					{/if}
				</button>
			</div>

		{#if formError}
			<p class="text-sm text-red-600 text-center mt-2">{formError}</p>
		{/if}

			<Button type="submit" variant="primary" size="lg" extraStyles="w-full">
				Sign In
			</Button>

			<div class="mt-4 text-center">
				<span class="text-gray-600">Don't have an account?</span>
				<a href="/onboarding/signup" class="ml-2 font-medium text-blue-600 hover:text-blue-800">Sign Up</a>
			</div>
		</form>
	</div>
</div>
