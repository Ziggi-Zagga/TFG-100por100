<script lang="ts">
	export let label: string;
	export let value: string | number | null | undefined | Date;
	export let uppercase: boolean = false;
</script>

<div class="rounded-xl bg-indigo-50 p-4">
	<h4 class="font-semibold text-gray-700">{label}</h4>
	<p class="text-gray-600">{uppercase ? String(value ?? 'N/A').toUpperCase() : (value ?? 'N/A')}</p>
</div>
