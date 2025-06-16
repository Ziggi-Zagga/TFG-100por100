<script lang="ts">
	import { fly, fade, scale, slide } from 'svelte/transition';
	import { page, navigating } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import type { AuthUser } from '$lib/types/auth.types';
	import Icon from '$lib/components/utilities/Icons/Icon.svelte';
	import { cubicOut } from 'svelte/easing';
	import ChatWidget from '$lib/components/utilities/ChatWidget/ChatWidget.svelte';

	let isSidebarOpen = $state(true);
	let isTransitioning = $state(false);
	let openInventoryMenu = $state(false);
	let inventoryMenuRef: HTMLElement;
	let isPageLoaded = $state(false);
	let showLoading = $state(false);
	let loadingTimer: NodeJS.Timeout;

	$effect(() => {
		if ($navigating) {
			loadingTimer = setTimeout(() => {
				showLoading = true;
			}, 100);
			isPageLoaded = false;
		} else {
			clearTimeout(loadingTimer);
			showLoading = false;
			const timer = setTimeout(() => {
				isPageLoaded = true;
			}, 150);
			return () => clearTimeout(timer);
		}

		return () => clearTimeout(loadingTimer);
	});

	function isActive(href: string) {
		if (href === '/dashboard/inventory') {
			return ['/dashboard/inventory', '/dashboard/products', '/dashboard/categories'].some(
				(route) => $page.url.pathname.startsWith(route)
			);
		}
		return $page.url.pathname.startsWith(href);
	}

	function isSubmenuActive(href: string) {
		return (
			$page.url.pathname === href ||
			($page.url.pathname.startsWith(href) && href !== '/dashboard/inventory')
		);
	}

	const { data, children } = $props<{
		data: {
			user: AuthUser;
		};
		children: any;
	}>();
	let collapsed = $state(false);
	async function toggleSidebar() {
		if (isTransitioning) return;
		isTransitioning = true;

		if (!collapsed) {
			isSidebarOpen = false;
			await new Promise((resolve) => setTimeout(resolve, 150));
		}

		collapsed = !collapsed;

		if (!collapsed) {
			await new Promise((resolve) => setTimeout(resolve, 300));
			isSidebarOpen = true;
		}

		isTransitioning = false;
	}

	function toggleInventoryMenu(e: Event) {
		e.preventDefault();
		e.stopPropagation();

		if (collapsed) {
			toggleSidebar().then(() => {
				openInventoryMenu = true;
			});
		} else {
			openInventoryMenu = !openInventoryMenu;
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (typeof window === 'undefined') return;

		if (inventoryMenuRef) {
			const target = event.target as HTMLElement;
			const isClickOnMenuLink = target.closest
				? target.closest(
						'a[href^="/dashboard/inventory"], a[href^="/dashboard/products"], a[href^="/dashboard/categories"]'
					)
				: null;

			if (!isClickOnMenuLink && inventoryMenuRef && !inventoryMenuRef.contains(target)) {
				openInventoryMenu = false;
			}
		}
	}

	const unsubscribe = page.subscribe(($page) => {
		const currentPath = $page.url.pathname;
		const isInventoryRoute = [
			'/dashboard/inventory',
			'/dashboard/products',
			'/dashboard/categories'
		].some((route) => currentPath.startsWith(route));

		if (!isInventoryRoute) {
			openInventoryMenu = false;
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('click', handleClickOutside);
		}
		unsubscribe();
	});

	import { browser } from '$app/environment';

	onMount(() => {
		if (browser) {
			setTimeout(() => {
				if (typeof document !== 'undefined') {
					document.addEventListener('click', handleClickOutside);
				}
			}, 0);
		}
	});
</script>

<!--
PARA AÑADIR UNO NUEVO COPIA ESTO Y SUSTITUYE LO QUE ESTA ENTRE []

<a href="[ENLACE]" class="flex items-center px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition">
          <img src="[IMAGEN]" class="w-8 h-8" alt="Logo" />
          {#if !collapsed}<span class="ml-3 text-sm font-medium">[TITULO]</span>{/if}
        </a>
-->

<div class="flex h-screen bg-gray-100 text-gray-800">
	<aside
		class="relative flex h-full flex-col overflow-hidden rounded-2xl border-r border-gray-200 bg-white shadow-xl"
		style={`width: ${collapsed ? '4.5rem' : '14rem'}; transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);`}
	>
		<div class="px-4 py-4">
			<div
				onclick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					toggleSidebar();
				}}
				class="mt-2 -ml-2 flex cursor-pointer items-center gap-2 rounded-lg hover:bg-gray-100"
			>
				<div class="flex h-15 w-12 flex-shrink-0 items-center justify-center">
					<img
						src="/logo/logo.png"
						class="h-16 w-13 object-contain"
						alt="Logo"
						style="transition: none;"
					/>
				</div>
				<span
					class="overflow-hidden text-lg font-bold text-ellipsis whitespace-nowrap"
					in:fade={{ duration: 200 }}
					out:fade={{ duration: 100 }}
					style="opacity: {isSidebarOpen ? 1 : 0}; transition: opacity 200ms ease-out;"
				>
					NG Manager
				</span>
			</div>
		</div>

		<div class="flex-1 overflow-y-auto">
			<div class="mt-2">
				<div
					class="overflow-hidden px-4 text-xs tracking-wider text-gray-400 uppercase"
					in:slide={{ duration: 300, delay: 150, easing: cubicOut }}
					out:slide={{ duration: 200, easing: cubicOut }}
					style="display: {!collapsed ? 'block' : 'none'}"
				></div>
				<nav class="flex flex-col gap-1">
					<a
						href="/dashboard"
						class={`flex cursor-pointer items-center rounded-md px-4 py-2 transition ${$page.url.pathname === '/dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`}
					>
						<img src="/icons/svg/dashboard.svg" class="h-8 w-8" alt="Dashboard" />
						{#if !collapsed}<span class="ml-3 text-sm font-medium">Dashboard</span>{/if}
					</a>

					<div bind:this={inventoryMenuRef} class="relative">
						<button
							type="button"
							class={`flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-2 transition ${isActive('/dashboard/inventory') ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`}
							onclick={toggleInventoryMenu}
							aria-expanded={openInventoryMenu}
							aria-controls="inventory-submenu"
						>
							<div class="flex items-center">
								<img src="/icons/svg/box.svg" class="h-8 w-8" alt="Storage" />
								{#if !collapsed}<span class="ml-3 text-sm font-medium">Storage</span>{/if}
							</div>
							{#if !collapsed}
								<div class:rotate-90={openInventoryMenu} class="transition-transform">
									<Icon icon="right" size={16} />
								</div>
							{/if}
						</button>

						{#if openInventoryMenu && !collapsed}
							<div id="inventory-submenu" class="mt-1 ml-8 space-y-1">
								<a
									href="/dashboard/inventory"
									class="flex items-center rounded-md px-4 py-2 text-sm transition hover:bg-blue-200 hover:text-blue-900"
									class:bg-blue-200={isSubmenuActive('/dashboard/inventory')}
									class:text-blue-900={isSubmenuActive('/dashboard/inventory')}
								>
									<span class="mr-3 h-2 w-2 rounded-full bg-blue-500"></span>
									<span>Inventory</span>
								</a>
								<a
									href="/dashboard/products"
									class="flex items-center rounded-md px-4 py-2 text-sm transition hover:bg-blue-200 hover:text-blue-900"
									class:bg-blue-200={isSubmenuActive('/dashboard/products')}
									class:text-blue-900={isSubmenuActive('/dashboard/products')}
								>
									<span class="mr-3 h-2 w-2 rounded-full bg-blue-500"></span>
									<span>Products</span>
								</a>
								<a
									href="/dashboard/categories"
									class="flex items-center rounded-md px-4 py-2 text-sm transition hover:bg-blue-200 hover:text-blue-900"
									class:bg-blue-200={isSubmenuActive('/dashboard/categories')}
									class:text-blue-900={isSubmenuActive('/dashboard/categories')}
								>
									<span class="mr-3 h-2 w-2 rounded-full bg-blue-500"></span>
									<span>Categories</span>
								</a>
							</div>
						{/if}
					</div>

					<a
						href="/dashboard/suppliers"
						class={`flex items-center rounded-md px-4 py-2 transition ${isActive('/dashboard/suppliers') ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`}
						aria-current={isActive('/dashboard/suppliers') ? 'page' : undefined}
					>
						<img src="/icons/svg/suppliers.svg" class="h-8 w-8" alt="Suppliers" />
						{#if !collapsed}<span class="ml-3 text-sm font-medium">Suppliers</span>{/if}
					</a>

					<a
						href="/dashboard/orders/ordersList"
						class={`flex items-center rounded-md px-4 py-2 transition ${isActive('/dashboard/orders') ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`}
						aria-current={isActive('/dashboard/orders') ? 'page' : undefined}
					>
						<img src="/icons/svg/orders.svg" class="h-8 w-8" alt="Orders" />
						{#if !collapsed}<span class="ml-3 text-sm font-medium">Orders</span>{/if}
					</a>

					<a
						href="/dashboard/warehouses"
						class={`flex items-center rounded-md px-4 py-2 transition ${isActive('/dashboard/warehouse') ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`}
						aria-current={isActive('/dashboard/warehouse') ? 'page' : undefined}
					>
						<img src="/icons/svg/warehouse.svg" class="h-8 w-8" alt="warehouse" />
						{#if !collapsed}<span class="ml-3 text-sm font-medium">Warehouse</span>{/if}
					</a>

					<a
						href="/dashboard/aiChat"
						class={`flex items-center rounded-md px-4 py-2 transition ${isActive('/dashboard/aiChat') ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`}
						aria-current={isActive('/dashboard/aiChat') ? 'page' : undefined}
					>
						<img src="/icons/svg/robot-svgrepo-com.svg" class="h-8 w-8" alt="AI" />
						{#if !collapsed}<span class="ml-3 text-sm font-medium">NGM chatAI</span>{/if}
					</a>
				</nav>
			</div>
		</div>

		<div class="mt-auto border-t border-gray-200">
			<div class="py-2">
				<nav class="mt-1 flex flex-col gap-1">
					<a
						href="/dashboard/users"
						class={`flex items-center rounded-md px-4 py-2 transition ${isActive('/dashboard/users') ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`}
						aria-current={isActive('/dashboard/users') ? 'page' : undefined}
					>
						<img src="/icons/svg/users.svg" class="h-8 w-8" alt="Users" />
						{#if !collapsed}<span class="ml-3 text-sm font-medium">Users</span>{/if}
					</a>
					<!--
          <a href="/dashboard/settings" class={`flex items-center px-4 py-2 rounded-md transition ${isActive('/dashboard/settings') ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100 hover:text-blue-700'}`} aria-current={isActive('/dashboard/settings') ? 'page' : undefined}>
            <img src="/icons/png/ajuste.png" class="w-8 h-8" alt="Settings" />
            {#if !collapsed}<span class="ml-3 text-sm font-medium">Settings</span>{/if}
          </a>
          -->
				</nav>
			</div>

			<form method="POST" action="/logout" class="w-full">
				<button
					type="submit"
					class="flex w-full items-center px-4 py-2 text-black transition hover:bg-blue-100 hover:text-blue-700"
				>
					<img src="/icons/svg/logout.svg" class="h-8 w-8" alt="Logout" />
					{#if !collapsed}<span class="ml-3 text-sm font-medium">Logout</span>{/if}
				</button>
			</form>
		</div>
	</aside>

	<main class="relative flex-1 overflow-y-auto rounded-2xl pl-2">
		{#if isPageLoaded}
			<div in:fade={{ duration: 300 }}>
				{@render children()}
			</div>
		{/if}

		{#if showLoading}
			<div
				class="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm"
				in:fly={{ y: -5, duration: 200 }}
				out:fly={{ y: 5, duration: 200 }}
			>
				<div
					class="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
				></div>
			</div>
		{/if}
	</main>

	{#if !$page.url.pathname.startsWith('/dashboard/aiChat')}
		<ChatWidget />
	{/if}
</div>
