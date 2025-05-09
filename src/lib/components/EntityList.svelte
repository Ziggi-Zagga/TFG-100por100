<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    export let title: string;
    export let columns: string[] = [];
    export let items: any[] = [];
    export let searchPlaceholder: string = 'Search...';
    export let onRowClick: (id: number) => void = () => {};
  
    let search = '';
    let showDrawer = false;
  
    function openDrawer() {
      showDrawer = true;
    }
  
    function closeDrawer() {
      showDrawer = false;
    }
  </script>
  
  <section class="p-8 bg-white w-full min-h-screen space-y-6">
  
    <!-- HEADER & ACTIONS -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <h1 class="text-2xl font-bold">{title}</h1>
  
      <div class="flex flex-wrap gap-3 md:justify-end">
        <button class="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md" onclick={openDrawer}>
          + Add
        </button>
      </div>
    </div>
  
    <!-- SEARCH BAR -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <input
        type="text"
        placeholder={searchPlaceholder}
        bind:value={search}
        class="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  
    <!-- TABLE -->
    <div class="overflow-x-auto">
      <table class="w-full table-auto border border-gray-300 text-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            {#each columns as col}
              <th class="p-3 text-left font-semibold">{col}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each items.filter(item =>
            Object.values(item).some(val =>
              (val?.toString()?.toLowerCase() ?? '').includes(search.toLowerCase())
            )
          ) as item}
            <tr
              class="hover:bg-gray-50 cursor-pointer border-t"
              onclick={() => onRowClick(item.id)}
            >
              {#each columns as col}
                <td class="p-3 whitespace-nowrap">{item[col.toLowerCase()]}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  
    <!-- DRAWER -->
    {#if showDrawer}
      <div class="fixed inset-0 bg-black/30 z-40" onclick={closeDrawer}></div>
      <div class="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl p-8 flex flex-col gap-6 overflow-y-auto z-50">
        <slot name="drawerContent" {closeDrawer}></slot>
      </div>
    {/if}
  </section>
  