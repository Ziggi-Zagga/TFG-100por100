<script lang="ts">
	const { size = 24, extraStyles = '' }: { size?: number; extraStyles?: string } = $props();
</script>

<svg
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	class={extraStyles}
>
	<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
	<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
	<g id="SVGRepo_iconCarrier">
		<path
			d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
			stroke="currentColor"
			stroke-width="2"
		></path>
		<path
			d="M8 8L16 16M16 8L8 16"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		></path>
	</g>
</svg>
