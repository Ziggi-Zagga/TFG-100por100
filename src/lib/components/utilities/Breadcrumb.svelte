<script lang="ts">
	const { segments } = $props<{
		segments: { name: string; href?: string }[];
	}>();
</script>

<nav class="text-sm text-gray-500 flex items-center flex-wrap gap-1">
	{#each segments as { name, href }, i}
		{#if href}
			<a href={href} class="text-blue-600 hover:underline">{name}</a>
		{:else}
			<span class="font-semibold text-gray-700">{name}</span>
		{/if}
		{#if i < segments.length - 1}
			<span class="mx-1 text-gray-400">/</span>
		{/if}
	{/each}
</nav>
