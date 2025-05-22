<script lang="ts">
	import { fly } from 'svelte/transition';

	const { title, onClose, children } = $props<{
		title: string;
		onClose: () => void;
		children?: any;
	}>();

	function handleKeyClose(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

</script>

<div
	class="fixed inset-0 bg-black/30 z-40"
	onclick={onClose}
	onkeydown={handleKeyClose}
	tabindex="0"
	role="button"
	aria-label="Close drawer"
></div>

<div
	class="fixed top-0 right-0 z-50 h-full w-30% max-w-3xl overflow-y-auto rounded-l-3xl border-l border-blue-100 bg-white shadow-2xl p-10"
	in:fly={{ x: 0, duration: 300 }}
	out:fly={{ x: 300, duration: 200 }}
>
	<h2 class="mb-8 text-3xl font-bold text-blue-800">{title}</h2>
	{@render children?.()}
</div>
