<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';

	const {
		title,
		onClose,
		children,
		show = false
	} = $props<{
		title: string;
		onClose: () => void;
		children?: any;
		show?: boolean;
	}>();

	function handleKeyClose(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

{#if show}
	<div
		class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		onclick={onClose}
		onkeydown={handleKeyClose}
		tabindex="0"
		role="button"
		aria-label="Close drawer"
	></div>

	<div
		class="fixed top-0 right-0 z-50 h-full w-full max-w-xl overflow-y-auto bg-white shadow-xl"
		in:fly={{ x: '100%', duration: 300, easing: cubicOut }}
		out:fly={{ x: '100%', duration: 200, easing: cubicIn }}
		style="will-change: transform;"
	>
		<div class="relative flex min-h-full flex-col">
			<div class="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-semibold text-gray-900">{title}</h2>
					<button
						onclick={onClose}
						class="text-gray-400 transition-colors hover:text-gray-500"
						aria-label="Cerrar"
					>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			</div>

			<div class="flex-1 p-6">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
