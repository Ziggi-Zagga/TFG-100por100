<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  import { animations, classes, sizes } from './button.utils';

  let {
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    icon,
    animate,
    extraStyles,
    ...others
  }: {
    children: Snippet;
    variant: 'primary' | 'secondary' | 'tertiary' | 'quarternary';
    size: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    icon?: string;
    animate?: 'spin';
    extraStyles?: string;
  } & HTMLButtonAttributes = $props();

</script>

<div class={extraStyles}>
  <button
    {disabled}
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
    {...others}
  >
    {#if icon}
      <img
        src={icon}
        alt="icon"
        height={14}
        width={14}
        class="{animate ? animations[animate] : ''} transition-transform group-hover:scale-110"
      />
    {/if}
    {@render children?.()}
  </button>
</div>