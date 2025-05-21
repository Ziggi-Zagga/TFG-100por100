<script lang="ts"> 
	import { fly } from 'svelte/transition';
	export let title: string;
	export let onClose: () => void;
	export let children: () => void;

	function handleKeyClose(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<!-- Overlay -->
<div
	class="fixed inset-0 bg-black/30 z-40"
	on:click={onClose}
	on:keydown={handleKeyClose}
	tabindex="0"
	role="button"
	aria-label="Close drawer"
></div>

<!-- Drawer Panel -->
<div
	class="fixed top-0 right-0 z-50 h-full w-full max-w-3xl overflow-y-auto rounded-l-3xl border-l border-blue-100 bg-white shadow-2xl p-10"
	in:fly={{ x: 300, duration: 300 }}
	out:fly={{ x: 300, duration: 200 }}
>
	<!-- Título del Drawer -->
	<h2 class="mb-8 text-3xl font-bold text-blue-800">{title}</h2>

	<!-- Contenido del formulario u otros elementos -->
	<div class="space-y-4">
		{@render children?.()}
	</div>
</div>
