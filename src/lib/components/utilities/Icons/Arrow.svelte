<script lang="ts">
	const { size = 24, extraStyles = '' }: { size?: number; extraStyles?: string } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={extraStyles}
>
	<path
		d="M12 6V18M12 18L7 13M12 18L17 13"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	></path>
</svg>
