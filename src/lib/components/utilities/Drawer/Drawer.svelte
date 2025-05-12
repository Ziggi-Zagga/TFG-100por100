<script lang="ts">
	import { fly } from 'svelte/transition';
	export let title: string;
	export let onClose: () => void;

	function handleKeyClose(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>


<div
	class="fixed inset-0 bg-black/30 z-40"
	on:click={onClose}
	on:keydown={handleKeyClose}
	tabindex="0"
	role="button"
	aria-label="Close drawer"
></div>

<slot />
