<script lang="ts">
  import TextInput from '$lib/components/utilities/form/TextInput.svelte';
  import Button from '$lib/components/utilities/Button/Button.svelte';
  
  let showPassword = false;
  let showConfirmPassword = false;
  let username = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let error = '';
</script>

<div class="min-h-screen w-full flex items-center justify-center font-inter">
    <div class="w-full max-w-md flex flex-col items-center justify-center bg-white/90 shadow-xl rounded-3xl p-10 border border-gray-200">
      <div class="w-50 h-50 mx-auto rounded flex items-center justify-center text-xs text-gray-600">
        <img src="../logo/logo.png" alt="Logo" class="w-100 h-100 object-contain" />
      </div>
      <div class="text-center">
        <p class="text-gray-500 text-sm">Create a new user</p>
      </div>

      <form method="POST" class="space-y-4" autocomplete="off">
        <TextInput
          type="text"
          name="username"
          placeholder="Username"
          required
          bind:value={username}
          extraStyles=""
        />
        <TextInput
          type="email"
          name="email"
          placeholder="Email address"
          required
          bind:value={email}
          extraStyles=""
        />
        
        <div class="relative">
          <TextInput
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            required
            bind:value={password}
            extraStyles="pr-10"
          />
         
          <button
            type="button"
            class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabindex="-1"
            onclick={() => (showPassword = !showPassword)}
          >

            {#if showPassword}
              <img src="../icons/visible.png" alt="visible" class="h-4.5 w-5.5" />
            {:else}
              <img src="../icons/hide.png" alt="hide" class="h-5 w-5.5" />
            {/if}
          </button>
        </div>
        <div class="relative">
          <TextInput
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm password"
            required
            bind:value={confirmPassword}
            extraStyles="pr-10"
          />
          <button
            type="button"
            class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            tabindex="-1"
            onclick={() => (showConfirmPassword = !showConfirmPassword)}
          >
            {#if showConfirmPassword}
              <img src="../icons/visible.png" alt="visible" class="h-4.5 w-5.5" />
            {:else}
              <img src="../icons/hide.png" alt="hide" class="h-5 w-5.5" />
            {/if}
          </button>
        </div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          extraStyles="w-full"
        >
          Create user
        </Button>
        {#if error}
          <span class="mt-1 text-xs font-medium text-red-500">{error}</span>
        {/if}
      </form>
    </div>
</div>