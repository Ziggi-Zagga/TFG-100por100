<script lang="ts">
	let { size = 24, extraStyles = '' }: { size?: number; extraStyles?: string } = $props();
</script>

<svg
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	class={extraStyles}
	><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
		id="SVGRepo_tracerCarrier"
		stroke-linecap="round"
		stroke-linejoin="round"
	></g><g id="SVGRepo_iconCarrier">
		<g id="Edit / Add_Plus">
			<path
				id="Vector"
				d="M6 12H12M12 12H18M12 12V18M12 12V6"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			></path>
		</g>
	</g></svg
>
