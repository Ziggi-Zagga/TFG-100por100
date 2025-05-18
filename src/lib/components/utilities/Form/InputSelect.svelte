<script lang="ts">
  import { cn } from '$lib/utils';

  let {
    label,
    value = $bindable(),
    name,
    options = [],
    required = false,
    disabled = false,
    error = '',
    extraStyles = ''
  }: {
    label?: string;
    value?: string;
    name?: string;
    options?: Array<{ id: string; name: string; code: string }>;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    extraStyles?: string;
  } = $props();
</script>

<div class="flex flex-col gap-1.5">
  {#if label}
    <label for={name} class="text-sm font-medium tracking-wide text-fresh-300">
      {label}
      {#if required}
        <span class="text-coral-500">*</span>
      {/if}
    </label>
  {/if}

  <div class="relative">
    <select
      id={name}
      name={name}
      bind:value
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
      {disabled}
      {required}
    >
      <option disabled value="" selected={value === ''}>
        Select an option
      </option>
      {#each options as option}
        <option value={option.id} selected={value === option.id}>
          {option.name}
        </option>
      {/each}
    </select>

    {#if error}
      <span class="mt-1 text-xs font-medium text-red-500">{error}</span>
    {/if}
  </div>
</div>
