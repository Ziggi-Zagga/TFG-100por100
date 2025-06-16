<script lang="ts">
	import { fade, slide, scale } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';
	import Icon from '$lib/components/utilities/Icons/Icon.svelte';

	const {
		gapName = '',
		onClose = () => {},
		class: className = ''
	} = $props<{
		gapName: string;
		onClose: () => void;
		class?: string;
	}>();

	let isExpanded = $state(false);

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
		setTimeout(() => {
			onClose();
		}, 300);
	}
</script>

<div class="flex items-center {className}">
	<div
		class="flex h-10 items-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm"
		style="width: {isExpanded ? 'auto' : '2.5rem'}; padding: 0 {isExpanded
			? '0.75rem'
			: '0'}; gap: {isExpanded ? '0.5rem' : '0'}"
		in:slide|local={{ duration: 300, easing: quadInOut, axis: 'x' }}
		out:slide|local={{ duration: 250, easing: quadInOut, axis: 'x' }}
	>
		<div class="-mr-2 flex h-12 w-12 flex-shrink-0 items-center justify-center">
			{#if isExpanded}
				<Icon icon="gap" size={20} extraStyles="text-gray-600 hover:text-red-500" />
			{/if}
		</div>

		{#if isExpanded}
			<div
				class="overflow-hidden whitespace-nowrap"
				in:slide|local={{ duration: 200, easing: quadInOut, axis: 'x' }}
				out:slide|local={{ duration: 200, easing: quadInOut, axis: 'x' }}
			>
				<span class="text-base text-gray-600">Gap: {gapName}</span>
			</div>
		{/if}

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
	.transition-all {
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 300ms;
	}

	.overflow-hidden {
		overflow: hidden;
	}
</style>
