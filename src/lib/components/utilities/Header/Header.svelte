<script lang="ts">
	import { classes } from './header.utils';

	const {
		title,
		subtitle = '',
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
	<div class="sticky top-0 z-40 mb-5 w-full border-b border-gray-300 bg-white shadow-md">
		<div class="flex items-center justify-between px-6 py-4" style={classes[extraStyles]}>
			<div class="flex items-center space-x-4">
				<h1 class="text-2xl font-bold text-gray-900">{title}</h1>
				{#if subtitle}
					<span class="text-sm text-gray-500">•</span>
					<span class="text-sm text-gray-600">{subtitle}</span>
				{/if}
			</div>

			<div class="flex items-center space-x-4">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
