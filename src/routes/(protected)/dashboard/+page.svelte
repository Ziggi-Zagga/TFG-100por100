<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { fade, slide, scale } from 'svelte/transition';
  
  // Store for theme and sidebar state
  const darkMode = writable(false);
  const sidebarCollapsed = writable(false);
  
  // Mock user data
  const user = {
    name: 'Miguel Rodríguez',
    email: 'miguel@ejemplo.com',
    avatar: '/images/avatar.png'
  };
  
  // Mock notifications
  const notifications = [
    { id: 1, title: 'New message', content: 'You have a new message from Carlos', time: '5m ago', read: false },
    { id: 2, title: 'Meeting reminder', content: 'Team meeting in 15 minutes', time: '10m ago', read: false },
    { id: 3, title: 'Task complete', content: 'Project "Dashboard" was completed', time: '1h ago', read: true }
  ];
  
  // Menu icons mapping
  const icons = {
    dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    analytics: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    customers: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    projects: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    notifications: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    theme: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
  };
  
  // Menu items
  const menuItems = [
    {
      title: 'Dashboard',
      icon: icons.dashboard,
      path: '/dashboard',
      active: true
    },
    {
      title: 'Analytics',
      icon: icons.analytics,
      path: '/analytics',
      active: false,
      subItems: [
        { title: 'Overview', path: '/analytics/overview' },
        { title: 'Reports', path: '/analytics/reports' },
        { title: 'Metrics', path: '/analytics/metrics' }
      ]
    },
    {
      title: 'Customers',
      icon: icons.customers,
      path: '/customers',
      active: false
    },
    {
      title: 'Projects',
      icon: icons.projects,
      path: '/projects',
      active: false,
      subItems: [
        { title: 'Active', path: '/projects/active' },
        { title: 'Archive', path: '/projects/archive' },
        { title: 'New Project', path: '/projects/new' }
      ]
    },
    {
      title: 'Settings',
      icon: icons.settings,
      path: '/settings',
      active: false
    }
  ];
  
  // Breadcrumbs
  const breadcrumbs = [
    { title: 'Home', path: '/' },
    { title: 'Dashboard', path: '/dashboard', active: true }
  ];
  
  // Mock stats data for widgets
  const stats = [
    { title: 'Total Users', value: '2,543', change: '+12.5%', changeType: 'positive' },
    { title: 'Revenue', value: '$45,241', change: '+8.3%', changeType: 'positive' },
    { title: 'Active Projects', value: '12', change: '-2', changeType: 'negative' },
    { title: 'Completion Rate', value: '87%', change: '+5%', changeType: 'positive' }
  ];
  
  // Open/closed state for dropdown menus
  let openMenus = {};
  
  // UI state variables
  let userMenuOpen = false;
  let notificationsOpen = false;
  let searchOpen = false;
  let mobileMenuOpen = false;
  
  // Corregir el uso de variables reactivas
  let sidebarCollapsed = false;
  let darkModeValue = false;
  darkMode.subscribe(value => (darkModeValue = value));
  sidebarCollapsed.subscribe(value => (sidebarCollapsed = value));
  
  // Toggle sidebar
  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    sidebarCollapsed.set(sidebarCollapsed);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', sidebarCollapsed.toString());
    }
  }
  
  // Toggle menu dropdowns
  function toggleMenu(menuTitle) {
    openMenus[menuTitle] = !openMenus[menuTitle];
  }
  
  // Toggle user menu dropdown
  function toggleUserMenu() {
    userMenuOpen = !userMenuOpen;
    if (userMenuOpen) {
      notificationsOpen = false;
      searchOpen = false;
    }
  }
  
  // Toggle notifications dropdown
  function toggleNotifications() {
    notificationsOpen = !notificationsOpen;
    if (notificationsOpen) {
      userMenuOpen = false;
      searchOpen = false;
    }
  }
  
  // Toggle search
  function toggleSearch() {
    searchOpen = !searchOpen;
    if (searchOpen) {
      userMenuOpen = false;
      notificationsOpen = false;
    }
  }
  
  // Toggle mobile menu for responsive design
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  // Toggle dark/light mode
  function toggleTheme() {
    darkModeValue = !darkModeValue;
    darkMode.set(darkModeValue);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('darkMode', darkModeValue.toString());
    }
    if (darkModeValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  onMount(() => {
    // Revisar disponibilidad de localStorage
    if (typeof localStorage !== 'undefined') {
      const savedSidebarState = localStorage.getItem('sidebarCollapsed');
      if (savedSidebarState) {
        sidebarCollapsed = savedSidebarState === 'true';
        sidebarCollapsed.set(sidebarCollapsed);
      }
      
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme) {
        darkModeValue = savedTheme === 'true';
        darkMode.set(darkModeValue);
        if (darkModeValue) {
          document.documentElement.classList.add('dark');
        }
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        darkModeValue = prefersDark;
        darkMode.set(darkModeValue);
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        }
      }
    }
    
    // Initialize openMenus object
    menuItems.forEach(item => {
      if (item.subItems) {
        openMenus[item.title] = false;
      }
    });
  });
</script>

<div class="h-screen w-full flex flex-col overflow-hidden font-inter bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
  <!-- Header -->
  <header class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-30 shadow-sm">
    <!-- Logo and mobile menu button -->
    <div class="flex items-center space-x-4">
      <!-- Mobile menu button - only visible on small screens -->
      <button 
        class="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        on:click={toggleMobileMenu}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <!-- Logo -->
      <img src="/logo/logo.png" alt="Logo" class="h-10 w-auto object-contain" />
    </div>
    
    <!-- Search -->
    <div class="hidden md:flex flex-1 max-w-lg mx-8">
      <div class="relative w-full">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={icons.search} />
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Search..." 
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm" 
        />
      </div>
    </div>
    
    <!-- User actions -->
    <div class="flex items-center space-x-2">
      <!-- Search button (mobile) -->
      <button 
        class="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        on:click={toggleSearch}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={icons.search} />
        </svg>
      </button>
      
      <!-- Theme toggle -->
      <button 
        class="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        on:click={toggleTheme}
        aria-label={$darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={$darkMode ? 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' : icons.theme} />
        </svg>
      </button>
      
      <!-- Notifications -->
      <div class="relative">
        <button 
          class="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          on:click={toggleNotifications}
          aria-label="Notifications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={icons.notifications} />
          </svg>
          <!-- Notification badge -->
          <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        {#if notificationsOpen}
          <div 
            class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700 z-50"
            transition:scale={{ duration: 200, start: 0.95 }}
          >
            <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 class="font-medium">Notifications</h3>
              <span class="text-xs text-gray-500 dark:text-gray-400">Mark all as read</span>
            </div>
            
            <div class="max-h-72 overflow-y-auto">
              {#each notifications as notification}
                <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 {notification.read ? '' : 'bg-indigo-50 dark:bg-indigo-900/20'}">
                  <div class="flex justify-between items-start">
                    <h4 class="text-sm font-medium">{notification.title}</h4>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-300 mt-1">{notification.content}</p>
                </div>
              {/each}
            </div>
            
            <div class="px-4 py-2 text-center">
              <a href="/notifications" class="text-sm text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300">View all notifications</a>
            </div>
          </div>
        {/if}
      </div>
      
      <!-- User profile -->
      <div class="relative">
        <button 
          class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          on:click={toggleUserMenu}
        >
          <span class="text-sm hidden md:block">{user.name}</span>
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-500 flex items-center justify-center text-white overflow-hidden">
            <span class="text-xs">{user.name.split(' ').map(n => n[0]).join('')}</span>
          </div>
        </button>
        
        {#if userMenuOpen}
          <div 
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700 z-50"
            transition:scale={{ duration: 200, start: 0.95 }}
          >
            <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
              <p class="text-sm font-medium">{user.name}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            <a href="/profile" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Profile</a>
            <a href="/settings" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Settings</a>
            <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            <a href="/logout" class="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</a>
          </div>
        {/if}
      </div>
    </div>
  </header>
  
  <!-- Mobile search overlay -->
  {#if searchOpen}
    <div 
      class="absolute inset-0 bg-gray-900/50 z-40 flex items-start justify-center p-4 md:hidden"
      transition:fade={{ duration: 200 }}
      on:click={() => searchOpen = false}
    >
      <div 
        class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mt-16"
        transition:scale={{ duration: 200, start: 0.95 }}
        on:click|stopPropagation
      >
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={icons.search} />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm" 
            autofocus
          />
        </div>
      </div>
    </div>
  {/if}
  
  <div class="flex flex-1 overflow-hidden">
    <!-- Mobile menu - only visible on small screens -->
    {#if mobileMenuOpen}
      <div 
        class="fixed inset-0 bg-gray-900/50 z-40 md:hidden"
        transition:fade={{ duration: 200 }}
        on:click={() => mobileMenuOpen = false}
      >
        <div 
          class="w-64 h-full bg-white dark:bg-gray-800 shadow-lg"
          transition:slide={{ duration: 300, axis: 'x' }}
          on:click|stopPropagation
        >
          <!-- Mobile sidebar content -->
          <div class="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <h2 class="font-medium">Menu</h2>
            <button 
              class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              on:click={() => mobileMenuOpen = false}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Mobile navigation -->
          <nav class="mt-2">
            {#each menuItems as item}
              <div class="px-2 py-1">
                {#if item.subItems}
                  <!-- Menu with dropdown -->
                  <button
                    class="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 {item.active ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : ''}"
                    on:click={() => toggleMenu(item.title)}
                  >
                    <div class="flex items-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
                      </svg>
                      <span class="text-sm">{item.title}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200 {openMenus[item.title] ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {#if openMenus[item.title]}
                    <div class="pl-10 py-1 space-y-1" transition:slide={{ duration: 200 }}>
                      {#each item.subItems as subItem}
                        <a 
                          href={subItem.path} 
                          class="block p-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {subItem.title}
                        </a>
                      {/each}
                    </div>
                  {/if}
                {:else}
                  <!-- Regular menu item -->
                  <a
                    href={item.path}
                    class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 {item.active ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : ''}"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
                    </svg>
                    <span class="text-sm">{item.title}</span>
                  </a>
                {/if}
              </div>
            {/each}
          </nav>
        </div>
      </div>
    {/if}
    
    <!-- Sidebar -->
    <aside 
      class="{sidebarCollapsed ? 'w-16' : 'w-64'} hidden md:block bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out"
    >
      <!-- Toggle sidebar button -->
      <button 
        class="p-3 m-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 self-end text-gray-500 dark:text-gray-400"
        on:click={toggleSidebar}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d={sidebarCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7M19 19l-7-7 7-7"} 
          />
        </svg>
      </button>
      
      <!-- Menu items -->
      <nav class="mt-2 flex-1 overflow-y-auto">
        {#each menuItems as item}
          <div class="px-2 py-1">
            {#if item.subItems}
              <!-- Menu with dropdown -->
              <button
                class="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 {item.active ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : ''}"
                on:click={() => toggleMenu(item.title)}
              >
                <div class="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
                  </svg>
                  {#if !$sidebarCollapsed}
                    <span class="text-sm">{item.title}</span>
                  {/if}
                </div>
                {#if !$sidebarCollapsed}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200 {openMenus[item.title] ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                {/if}
              </button>
              
              {#if openMenus[item.title] && !$sidebarCollapsed}
                <div class="pl-10 py-1 space-y-1" transition:slide={{ duration: 200 }}>
                  {#each item.subItems as subItem}
                    <a 
                      href={subItem.path} 
                      class="block p-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {subItem.title}
                    </a>
                  {/each}
                </div>
              {/if}
            {:else}
              <!-- Regular menu item -->
              <a
                href={item.path}
                class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 {item.active ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : ''}"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
                </svg>
                {#if !$sidebarCollapsed}
                  <span class="text-sm">{item.title}</span>
                {/if}
              </a>
            {/if}
          </div>
        {/each}
      </nav>
    </aside>
    
    <!-- Main content -->
    <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <!-- Breadcrumbs -->
      <div class="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="flex items-center text-sm">
          {#each breadcrumbs as crumb, index}
            <div class="flex items-center">
              {#if index > 0}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              {/if}
              {#if crumb.active}
                <span class="font-medium text-indigo-600 dark:text-indigo-400">{crumb.title}</span>
              {:else}
                <a href={crumb.path} class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">{crumb.title}</a>
              {/if}
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Dashboard content -->
      <div class="p-6">
        <div class="mb-6">
          <h1 class="text-2xl font-semibold">Dashboard Overview</h1>
          <p class="text-gray-600 dark:text-gray-400">Welcome back, {user.name}. Here's what's happening today.</p>
        </div>
        
        <!-- Stats cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {#each stats as stat}
            <div 
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-all duration-300 hover:shadow-md"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                <span class={`text-xs px-2 py-1 rounded-full ${stat.changeType === 'positive' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
                  {stat.change}
                </span>
              </div>
              <p class="mt-2 text-2xl font-semibold">{stat.value}</p>
            </div>
          {/each}
        </div>
        
        <!-- Charts section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Activity chart -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-medium">Activity Overview</h3>
              <div class="flex space-x-2">
                <button class="px-3 py-1 text-xs rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">Day</button>
                <button class="px-3 py-1 text-xs rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Week</button>
                <button class="px-3 py-1 text-xs rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Month</button>
              </div>
            </div>
            <!-- Chart placeholder -->
            <div class="h-64 w-full bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-lg flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400 text-sm">Activity Chart (visualization)</p>
            </div>
          </div>
          
          <!-- Revenue chart -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-medium">Revenue Analytics</h3>
              <div class="flex space-x-2">
                <button class="px-3 py-1 text-xs rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">Day</button>
                <button class="px-3 py-1 text-xs rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Week</button>
                <button class="px-3 py-1 text-xs rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Month</button>
              </div>
            </div>
            <!-- Chart placeholder -->
            <div class="h-64 w-full bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-lg flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400 text-sm">Revenue Chart (visualization)</p>
            </div>
          </div>
        </div>
        
        <!-- Recent activities and tasks -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent activities -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-medium">Recent Activities</h3>
              <button class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">View all</button>
            </div>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm"><span class="font-medium">Project Phoenix</span> was completed</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm"><span class="font-medium">Ana González</span> joined the team</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">5 hours ago</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm"><span class="font-medium">New project</span> was created</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Tasks -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-medium">Recent Tasks</h3>
              <button class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">View all</button>
            </div>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700" />
                <span class="text-sm">Update dashboard design</span>
                <span class="ml-auto px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">In Progress</span>
              </div>
              <div class="flex items-center space-x-3">
                <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700" />
                <span class="text-sm">Prepare client presentation</span>
                <span class="ml-auto px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">Urgent</span>
              </div>
              <div class="flex items-center space-x-3">
                <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700" checked />
                <span class="text-sm line-through text-gray-500">Review team performance</span>
                <span class="ml-auto px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Complete</span>
              </div>
              <div class="flex items-center space-x-3">
                <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700" />
                <span class="text-sm">Implement new API features</span>
                <span class="ml-auto px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  
  <!-- Footer -->
  <footer class="h-12 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 text-xs text-gray-500 dark:text-gray-400">
    <div>&copy; 2025 Your Company. All rights reserved.</div>
    <div class="flex space-x-4">
      <a href="/privacy" class="hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
      <a href="/terms" class="hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</a>
      <a href="/contact" class="hover:text-gray-700 dark:hover:text-gray-300">Contact</a>
    </div>
  </footer>
</div>

<style lang="postcss">
  @reference "tailwindcss";

  /* Additional custom styles */
  :global(body) {
    @apply antialiased text-gray-800 dark:text-gray-200;
  }
  
  /* For transitions - Important for dark mode */
  :global(.dark) {
    color-scheme: dark;
  }
  
  /* Scrollbar styling */
  :global(::-webkit-scrollbar) {
    width: 8px;
    height: 8px;
  }
  
  :global(::-webkit-scrollbar-track) {
    @apply bg-gray-100 dark:bg-gray-700;
  }
  
  :global(::-webkit-scrollbar-thumb) {
    @apply bg-gray-300 dark:bg-gray-600 rounded-full;
  }
  
  :global(::-webkit-scrollbar-thumb:hover) {
    @apply bg-gray-400 dark:bg-gray-500;
  }
</style>