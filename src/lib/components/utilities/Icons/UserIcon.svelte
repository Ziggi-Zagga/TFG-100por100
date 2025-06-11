<script lang="ts">
	const {
		size = 24,
		extraStyles = '',
		color = '#000000'
	}: { size?: number; extraStyles?: string; color?: string } = $props();
</script>

<svg
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	class={extraStyles}
>
	<path
		d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
		stroke={color}
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
