<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main class="relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-hidden">
    {@render children()}
</main>
