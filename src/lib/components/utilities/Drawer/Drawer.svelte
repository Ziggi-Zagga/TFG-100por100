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
	class="fixed inset-0 z-40 bg-black/30"
	on:click={onClose}
	on:keydown={handleKeyClose}
	tabindex="0"
	role="button"
	aria-label="Close drawer"
></div>
<div
  in:fly={{ x: 300, duration: 300 }}
  class="fixed top-0 right-0 w-full max-w-4xl h-full bg-white shadow-2xl p-10 rounded-l-3xl overflow-y-auto z-50 border-l border-blue-100"
>
	<slot />
</div>
