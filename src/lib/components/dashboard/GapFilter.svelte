<script lang="ts">
	import { fade, slide, scale } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';
	import Icon from '$lib/components/utilities/Icons/Icon.svelte';

	// Definir las props usando $props()
	const {
		gapName = '',
		onClose = () => {},
		class: className = ''
	} = $props<{
		gapName: string;
		onClose: () => void;
		class?: string;
	}>();

	// Estado reactivo
	let isExpanded = $state(false);

	// Expandir el filtro después de que se monte el componente
	$effect(() => {
		const timer = setTimeout(() => {
			isExpanded = true;
		}, 100);

		return () => clearTimeout(timer);
	});

	let isClosing = $state(false);

	function handleClose(e: Event) {
		e.preventDefault();
		if (isClosing) return;

		isClosing = true;
		isExpanded = false;
		// Esperar a que termine la animación antes de cerrar
		setTimeout(() => {
			onClose();
		}, 300);
	}
</script>

<div class="flex items-center {className}">
	<!-- Contenedor principal con forma de óvalo -->
	<div
		class="flex h-10 items-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm"
		style="width: {isExpanded ? 'auto' : '2.5rem'}; padding: 0 {isExpanded
			? '0.75rem'
			: '0'}; gap: {isExpanded ? '0.5rem' : '0'}"
		in:slide|local={{ duration: 300, easing: quadInOut, axis: 'x' }}
		out:slide|local={{ duration: 250, easing: quadInOut, axis: 'x' }}
	>
		<!-- Ícono -->
		<div class="-mr-2 flex h-12 w-12 flex-shrink-0 items-center justify-center">
			{#if isExpanded}
				<Icon icon="gap" size={20} extraStyles="text-gray-600 hover:text-red-500" />
			{/if}
		</div>

		<!-- Texto -->
		{#if isExpanded}
			<div
				class="overflow-hidden whitespace-nowrap"
				in:slide|local={{ duration: 200, easing: quadInOut, axis: 'x' }}
				out:slide|local={{ duration: 200, easing: quadInOut, axis: 'x' }}
			>
				<span class="text-base text-gray-600">Gap: {gapName}</span>
			</div>
		{/if}

		<!-- Botón de cierre -->
		{#if isExpanded}
			<button
				onclick={handleClose}
				class="flex-shrink-0 focus:outline-none"
				aria-label="Remove filter"
			>
				<Icon icon="cancelled" size={16} extraStyles="text-gray-600 hover:text-red-500" />
			</button>
		{/if}
	</div>
</div>

<style>
	/* Transiciones suaves */
	.transition-all {
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 300ms;
	}

	/* Asegurar que el contenedor no se desborde */
	.overflow-hidden {
		overflow: hidden;
	}
</style>
