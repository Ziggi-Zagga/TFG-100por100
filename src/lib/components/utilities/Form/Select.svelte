<script lang="ts">
	import { cn } from '$lib/utils';
	
	let {
		label,
		value = $bindable<string>(),
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
		value?: string;
		name?: string;
		options?: Array<{ id: string; name: string; code?: string }>;
		required?: boolean;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		error?: string;
		extraStyles?: string;
		onValueChange?: (val: string) => void;
		extraClass?: string;
		placeholder?: string;
	} = $props();

	$effect(() => onValueChange?.(value));
</script>

<div class="flex flex-col gap-1.5">
	{#if label}
		<label for={name} class="text-sm font-medium tracking-wide text-fresh-300">
			{label}{#if required}<span class="text-coral-500">*</span>{/if}
		</label>
	{/if}

	<div class="relative">
		<select
			id={name}
			name={name}
			bind:value
			{disabled}
			{required}
			{...rest}
			class={cn(
				'w-full rounded-lg border border-brand-300 bg-white/50',
				'font-inter text-brand-700 placeholder:text-brand-400/70',
				'transition-all duration-300',
				'hover:border-purple-600',
				'focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600/20',
				'disabled:cursor-not-allowed disabled:opacity-50',
				{
					'py-0.5 px-2 text-xs h-7': size === 'sm',
					'py-1.5 px-3 text-base h-9': size === 'md',
					'py-2 px-4 text-base h-11': size === 'lg'
				},
				extraStyles,
				error && 'border-error-500',
				disabled && 'bg-gray-100'
			)}
		>
			<option disabled value="" selected={value === ''}>
				Select an option
			</option>

			{#each options as option}
				<option value={option.id}>{option.name}</option>
			{/each}
		</select>

		{#if error}
			<span class="mt-1 text-xs font-medium text-red-500">{error}</span>
		{/if}
	</div>
</div>
