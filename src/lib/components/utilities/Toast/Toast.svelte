<!-- Toast.svelte -->
<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  export let message: string;
  export let type: 'success' | 'error' | 'info' = 'info';
  export let duration = 3000;

  const dispatch = createEventDispatcher();
  
  let timeoutId: NodeJS.Timeout;

  $: bgColor = type === 'success' 
    ? 'bg-green-500' 
    : type === 'error' 
    ? 'bg-red-500' 
    : 'bg-blue-500';


  function close() {
    dispatch('close');
  }

  $: if (duration) {
    timeoutId = setTimeout(close, duration);
  }

  // Cleanup on component destroy
  import { onDestroy } from 'svelte';
  onDestroy(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
</script>

<div
  class="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg"
  class:bg-red-500={type === 'error'}
  class:bg-green-500={type === 'success'}
  class:bg-blue-500={type === 'info'}
  transition:fly={{ y: 50, duration: 300 }}
  role="alert"
>
  <p class="text-sm">{message}</p>
</div>
