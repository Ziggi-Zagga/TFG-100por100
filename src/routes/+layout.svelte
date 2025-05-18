<script lang="ts">
	import "../app.css";
	let { children } = $props();
</script>

<head>
	<link rel="icon" type="image/png" href="/favicon.png" />
</head>

<main class="min-h-screen w-full">
	{@render children()}
</main>