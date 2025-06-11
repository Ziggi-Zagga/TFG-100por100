<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		label,
		value = $bindable<string | number>(),
		type = 'text',
		name,
		placeholder = '',
		required = false,
		disabled = false,
		error = '',
		extraStyles = '',
		size = 'md',
		min,
		max,
		step,
		onValueChange,
		extraClass,
		...rest
	}: {
		label?: string;
		value?: string | number;
		type?: string;
		name?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		extraStyles?: string;
		size?: 'sm' | 'md' | 'lg';
		min?: number;
		max?: number;
		step?: number;
		onValueChange?: (val: string | number) => void;
		extraClass?: string;
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
		<input
			{type}
			id={name}
			name={name}
			bind:value
			placeholder={placeholder}
			{min}
			{max}
			{step}
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
				{
					'py-1 px-1 text-sm h-9': size === 'sm',
					'py-2.5 px-3 text-sm h-11': size === 'md',
					'py-3 px-4 text-base h-14': size === 'lg'
				},
				type === 'number' && 'text-right',	
				extraStyles,
				error && 'border-error-500',
				disabled && 'bg-gray-100'
			)}
		/>
	</div>
</div>
