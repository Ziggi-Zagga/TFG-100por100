<script lang="ts">
	import Button from '$lib/components/utilities/Button/Button.svelte';

	let { message, onConfirm, onCancel, show } = $props<{
		message: string;
		onConfirm: () => void;
		onCancel: () => void;
		show: boolean;
	}>();

	let dialogRef = $state<HTMLDivElement | null>(null);

	let handleConfirm = (): void => {
		onConfirm();
		show = false;
	};

	let handleCancel = (): void => {
		onCancel();
		show = false;
	};

	function handleClickOutside(event: MouseEvent): void {
		if (dialogRef && event.target instanceof Node && !dialogRef.contains(event.target)) {
			handleCancel();
		}
	}

	$effect(() => {
		if (show) {
			const timer = setTimeout(() => {
				document.addEventListener('click', handleClickOutside);
			}, 100);

			return () => {
				clearTimeout(timer);
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
		<div
			class="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-lg"
			bind:this={dialogRef}
		>
			<p class="mb-6 text-lg font-medium">{message}</p>
			<div class="flex flex-col justify-center gap-3 sm:flex-row">
				<Button variant="secondary" size="md" extraStyles="w-full sm:w-auto" onclick={handleCancel}>
					Cancel
				</Button>
				<Button variant="primary" size="md" extraStyles="w-full sm:w-auto" onclick={handleConfirm}>
					Confirm
				</Button>
			</div>
		</div>
	</div>
{/if}
