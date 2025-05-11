<script lang="ts">
    export let columns: string[] = [];
    export let items: any[] = [];
    export let onRowClick: (id: number) => void = () => {};
  
    function formatHeader(header: string) {
      return header.charAt(0).toUpperCase() + header.slice(1);
    }
  </script>
  
  <div class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-7xl mx-auto">
    <div class="overflow-x-auto">
      <div class="max-h-[calc(100vh-250px)] overflow-y-auto">
        <table class="w-full table-auto text-sm text-gray-700 min-w-[800px] rounded-xl overflow-hidden shadow-sm">
          <thead class="sticky top-0 bg-indigo-50 border-b border-gray-200 text-gray-500 z-10">
            <tr>
              {#each columns as col}
                <th class="px-4 py-3 text-left font-semibold">{formatHeader(col)}</th>
              {/each}
              <th class="px-4 py-3 text-center font-semibold"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each items as item}
              <tr
                class="group hover:bg-gray-50 transition cursor-pointer"
                on:click={() => onRowClick(item.id)}
              >
                {#each columns as col}
                  <td class="px-4 py-3 whitespace-nowrap {col === 'quantity' ? 'font-semibold' : ''}">
                    {#if col === 'quantity'}
                      <span class={item[col] < 25 ? 'text-red-500 font-semibold' : 'text-gray-700'}>
                        {item[col]} units
                      </span>
                    {:else}
                      {item[col]}
                    {/if}
                  </td>
                {/each}
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150" role="group" aria-label="Row actions">
                    <button class="text-gray-500 hover:text-blue-600 transition" title="Edit" aria-label="Edit" type="button" on:click|stopPropagation>
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2m2 0h.01M7 5h.01M3 21h18M12 17v-5m0 0l-2-2m2 2l2-2" />
                      </svg>
                    </button>
                    <button class="text-gray-500 hover:text-red-600 transition" title="Delete" aria-label="Delete" type="button" on:click|stopPropagation>
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  