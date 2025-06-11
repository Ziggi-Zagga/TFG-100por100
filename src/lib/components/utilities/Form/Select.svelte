<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		label,
		value = $bindable<string | null>(),
		name,
		options = [],
		required = false,
		disabled = false,
		error = '',
		size = 'md',
		extraStyles = '',
		onValueChange,
		placeholder = '',
		...rest
	}: {
		label?: string;
		value?: string | null;
		name?: string;
		options?: Array<{ id: string; name: string; code?: string }>;
		required?: boolean;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		error?: string;
		extraStyles?: string;
		onValueChange?: (val: string | null) => void;
		extraClass?: string;
		placeholder?: string;
	} = $props();

	// Para que no envie "" cuando se selecciona la opción por defecto
	$effect(() => {
		if (value === '') value = null;
		onValueChange?.(value);
	});
</script>

<div class="flex flex-col gap-1.5">
	{#if label}
		<label for={name} class="text-fresh-300 text-sm font-medium tracking-wide">
			{label}{#if required}<span class="text-coral-500">*</span>{/if}
		</label>
	{/if}

	<div class="relative">
		<select
			id={name}
			{name}
			bind:value
			{disabled}
			{required}
			{...rest}
			class={cn(
				'border-brand-300 w-full rounded-lg border bg-white/50',
				'font-inter text-brand-700 placeholder:text-brand-400/70',
				'transition-all duration-300',
				'hover:border-purple-600',
				'focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20 focus:outline-none',
				'disabled:cursor-not-allowed disabled:opacity-50',
				{
					'h-7 px-2 py-0.5 text-xs': size === 'sm',
					'h-9 px-3 py-1.5 text-base': size === 'md',
					'h-11 px-4 py-2 text-base': size === 'lg'
				},
				extraStyles,
				error && 'border-error-500',
				disabled && 'bg-gray-100'
			)}
		>
			<option value="">-- Select an option --</option>
			{#each options as option}
				<option value={option.id}>{option.name}</option>
			{/each}
		</select>

		{#if error}
			<span class="mt-1 text-xs font-medium text-red-500">{error}</span>
		{/if}
	</div>
</div>
