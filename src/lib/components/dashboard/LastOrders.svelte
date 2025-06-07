<script lang="ts">
    import { currency } from '$lib/components/helpers/currencies';
    
    export let orders: {
      id: string;
      product: string;
      quantity: number;
      total: number;
      status: string;
    }[] = [];
  
    let scrollContainer: HTMLDivElement;
  
    function scrollLeft() {
      scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
    }
  
    function scrollRight() {
      scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
    }
  
    function getStatusStyle(status: string) {
      switch (status.toLowerCase()) {
        case 'shipped':
          return 'bg-green-100 text-green-700';
        case 'pending':
          return 'bg-yellow-100 text-yellow-700';
        case 'cancelled':
          return 'bg-red-100 text-red-700';
        default:
          return 'bg-gray-100 text-gray-600';
      }
    }
  </script>
  
  <section class="bg-white p-4 rounded-2xl shadow mt-4 space-y-3">
    <div class="flex items-center justify-between text-sm font-semibold text-gray-800">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2h6v2H9zM4 7h16M4 11h16M4 15h16" />
        </svg>
        <span>Last orders:</span>
      </div>
      <div class="flex gap-2">
        <button on:click={scrollLeft} class="p-1 rounded hover:bg-gray-100" aria-label="Scroll left">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button on:click={scrollRight} class="p-1 rounded hover:bg-gray-100" aria-label="Scroll right">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 6l6 6-6 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  
    <div
      bind:this={scrollContainer}
      class="flex overflow-x-auto gap-3 scroll-smooth scrollbar-hide py-1"
    >
    
      {#each orders as order}
      <!-- href={`/orders/${order.id}`} -->
        <a
          href="#"
          class="min-w-fit flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl shadow-sm text-sm 
                 flex-nowrap transform transition-transform duration-200 hover:scale-105 cursor-pointer hover:shadow-md 
                 no-underline text-gray-800"
          title="Click to view order details"
        >
          <span class="font-semibold">{order.id}</span>
          <span class="text-gray-700">{order.product} ×{order.quantity}</span>
          <span class="text-gray-800 font-medium">{order.total.toFixed(2)} {currency}</span>
          <span class={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusStyle(order.status)}`}>
            {order.status}
          </span>
        </a>
      {/each}
    </div>
  </section>
  
  <style>
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>
  