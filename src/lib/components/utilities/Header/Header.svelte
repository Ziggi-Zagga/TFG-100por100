<script lang="ts">
import { classes } from './header.utils';

  const {
    title,
    subtitle = 'items',
    children,
    variant = 'default',
  }: {
    title: string;
    subtitle?: string;
    children?: () => any;
    variant?: 'default' | 'plain' | 'dark' | 'compact';
  } = $props();
</script>

<div
  class="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl shadow-sm mb-6 w-full gap-4"
  style="{classes[variant]}"
>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800">{title}</h1>
    <p class="text-sm text-gray-700 mt-1">{subtitle}</p>
  </div>

  <div class="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
    {@render children?.()}
  </div>
</div>
