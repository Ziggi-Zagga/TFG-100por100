<script lang="ts">
	import { classes } from "./header.utils";

    const {
      title,
      subtitle = 'items',
      children,
      hidden = false,
      extraStyles = 'default'
    }: {
      title: string;
      subtitle?: string;
      children?: () => any;
      hidden?: boolean;
      extraStyles?: 'default' | 'plain' | 'dark' | 'compact';
    } = $props();
  </script>
  
  {#if !hidden}
  <!-- Clean sticky header matching warehouse layout exactly -->
  <div class="sticky top-0 z-40 w-full bg-white border-b border-gray-300 shadow-md mb-5">
    <div
      class="flex items-center justify-between px-6 py-4"
      style={classes[extraStyles]}
    >
      <!-- Left side - Title section clean and minimal -->
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-bold text-gray-900">{title}</h1>
        {#if subtitle}
          <span class="text-sm text-gray-500">•</span>
          <span class="text-sm text-gray-600">{subtitle}</span>
        {/if}
      </div>
      
      <!-- Right side - Actions -->
      <div class="flex items-center space-x-4">
        {@render children?.()}
      </div>
    </div>
  </div>
  {/if}
  