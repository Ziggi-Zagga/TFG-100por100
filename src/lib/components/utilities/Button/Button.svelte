<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  import { animations, classes, sizes } from './button.utils';

  const dispatch = createEventDispatcher();

  let {
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    animate,
    extraStyles,
    type = 'button',
    ...others
  }: {
    children: Snippet;
    variant: 'primary' | 'secondary' | 'tertiary' | 'quarternary';
    size: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    animate?: 'spin';
    extraStyles?: string;
    type?: 'button' | 'submit' | 'reset';
  } & HTMLButtonAttributes = $props();
  
  let isButtonDisabled = $derived(disabled || loading);

  function handleClick(event: Event) {
    if (isButtonDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    dispatch('click', event);
    return true;
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      return handleClick(event);
    }
    return true;
  }
</script>

<div class={extraStyles}>
  <button
    type={type}
    disabled={isButtonDisabled}
    class="group {classes[variant]} {sizes[size]} relative z-[1] flex w-full transform
    items-center justify-center gap-3 rounded-lg font-inter
    font-medium tracking-wide shadow-sm ring-1 ring-white/10
    transition-all duration-200 ease-out
    before:absolute before:inset-0 before:rounded-lg
    before:bg-gradient-to-br before:from-white/10 before:to-transparent
    before:opacity-0 before:transition-opacity
    hover:scale-[1.02] hover:shadow-md hover:ring-white/20
    hover:before:opacity-100 active:scale-[0.98] active:shadow-sm active:ring-white/5
    disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
    onclick={handleClick}
    onkeydown={handleKeyDown}
    aria-busy={loading}
    {...others}
  >
    {#if loading}
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="sr-only">Cargando...</span>
    {:else if icon}
      <img
        src={icon}
        alt=""
        height={14}
        width={14}
        class="{animate ? animations[animate] : ''} transition-transform group-hover:scale-110"
        aria-hidden="true"
      />
    {/if}
    <span class:invisible={loading} class:opacity-0={loading} style="transition: opacity 200ms ease-out">
      {@render children?.()}
    </span>
  </button>
</div>