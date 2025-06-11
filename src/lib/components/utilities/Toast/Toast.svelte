<script lang="ts">
	import { fly } from 'svelte/transition';

	const {
		message,
		type = 'info',
		duration = 3000,
		onClose
	} = $props<{
		message: string;
		type?: 'success' | 'error' | 'info';
		duration?: number;
		onClose?: () => void;
	}>();

	let timeoutId: NodeJS.Timeout | null = null;
	let isVisible = $state(true);

	const bgColor = $derived(
		type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
	);

	function close() {
		isVisible = false;
		onClose?.();
	}

	$effect(() => {
		if (duration && duration > 0) {
			timeoutId = setTimeout(close, duration);
			return () => {
				if (timeoutId) clearTimeout(timeoutId);
			};
		}
		return undefined;
	});
</script>

{#if isVisible}
	<div
		class="fixed right-22 bottom-6 z-50 flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg {bgColor}"
		transition:fly={{ y: 50, duration: 300 }}
		role="alert"
	>
		<p class="text-sm font-medium">{message}</p>
		<button
			type="button"
			class="ml-2 text-white hover:text-gray-200 focus:outline-none"
			onclick={close}
			aria-label="Close"
		>
			<span class="text-xl">&times;</span>
		</button>
	</div>
{/if}
