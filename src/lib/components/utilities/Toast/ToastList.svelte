<!-- ToastList.svelte -->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import Toast from './Toast.svelte';

	export let toasts: Array<{
		id: string;
		message: string;
		type: 'success' | 'error' | 'info';
	}> = [];

	export function addToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
		const id = crypto.randomUUID();
		toasts = [...toasts, { id, message, type }];
		setTimeout(() => {
			removeToast(id);
		}, 3000);
	}

	function removeToast(id: string) {
		toasts = toasts.filter((t) => t.id !== id);
	}
</script>

<div class="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
	{#each toasts as toast (toast.id)}
		<Toast message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
	{/each}
</div>
