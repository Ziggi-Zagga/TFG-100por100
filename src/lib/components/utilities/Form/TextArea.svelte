<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	let {
		value = $bindable<string>(),
		name,
		label,
		required = false,
		placeholder = '',
		rows = 4,
		disabled = false,
		error = '',
		extraStyles = '',
		onValueChange,
		...rest
	}: {
		value?: string;
		name?: string;
		label?: string;
		required?: boolean;
		placeholder?: string;
		rows?: number;
		disabled?: boolean;
		error?: string;
		extraStyles?: string;
		onValueChange?: (val: string) => void;
	} & HTMLTextareaAttributes = $props();

	$effect(() => onValueChange?.(value));
</script>

<div class="flex flex-col gap-1.5">
	{#if label}
		<label for={name} class="text-sm font-medium tracking-wide text-fresh-300">
			{label}{#if required}<span class="text-coral-500">*</span>{/if}
		</label>
	{/if}

	<div class="relative">
		<textarea
			id={name}
			name={name}
			bind:value
			{rows}
			{placeholder}
			{required}
			{disabled}
			{...rest}
			class={cn(
				'w-full rounded-xl border border-brand-300 bg-white/50 px-4 py-2.5',
				'font-inter text-brand-700 placeholder:text-brand-400/70',
				'transition-all duration-300',
				'hover:border-purple-600',
				'focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20',
				'disabled:cursor-not-allowed disabled:opacity-50',
				extraStyles,
				error && 'border-error-500',
				disabled && 'bg-gray-100'
			)}
		></textarea>

		{#if error}
			<span class="mt-1 text-xs font-medium text-red-500">{error}</span>
		{/if}
	</div>
</div>
