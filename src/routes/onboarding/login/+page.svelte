<script lang="ts">
  import { scale } from 'svelte/transition';
  import { onMount } from 'svelte';
  export let form: any;
  let showPassword = false;
  let showModal = false;

  onMount(() => {

    showModal = true;
  });
</script>

<div class="min-h-screen w-full flex items-center justify-center font-inter">
  {#if showModal}
    <div
      class="w-full max-w-md flex flex-col items-center justify-center bg-white/90 shadow-xl rounded-3xl p-10 border border-gray-200"
      in:scale={{ duration: 1500, start: 0.8 }}
    >
    <!-- Simulated Logo -->
    <div class="w-50 h-50 mx-auto rounded flex items-center justify-center text-xs text-gray-600">
      <img src="../logo/logo.png" alt="Logo" class="w-100 h-100 object-contain" />
    </div>

    <!-- Heading -->
    <div class="text-center">
      <p class="text-gray-500 text-sm">Please sign in to continue</p>
    </div>

    <!-- Form -->
    <form method="POST" class="space-y-4" autocomplete="off">
      <input
        type="email"
        name="email"
        placeholder="Email address"
        required
        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
        autocomplete="off"
      />

      <div class="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          required
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm pr-10"
          autocomplete="new-password"
          id="password-input"
        />
        <button
          type="button"
          class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          tabindex="-1"
          onclick={() => (showPassword = !showPassword)}
        >
          {#if showPassword}
          <img src="../icons/visible.png" alt= "visible" class="h-4.5 w-5.5" >
          {:else}
          <img src="../icons/hide.png" alt= "hide" class="h-5 w-5.5" >
          {/if}
        </button>
      </div>

      {#if form?.message}
        <p class="text-red-600 text-sm">{form.message}</p>
      {/if}

      <button
        type="submit"
        class="w-full py-3 rounded-full bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-500 hover:bg-gradient-to-br hover:from-cyan-600 hover:via-indigo-700 hover:to-purple-800 text-white font-semibold transition"
      >
        Sign In
      </button>
    </form>
  </div>
  {/if}
</div>
