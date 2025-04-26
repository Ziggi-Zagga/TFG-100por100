<script lang="ts">
  let showPassword = false;
  let showConfirmPassword = false;
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
      <input
        type="text"
        name="username"
        placeholder="Username"
        required
        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
        autocomplete="off"
      />
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
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Confirm password"
          required
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm pr-10"
          autocomplete="new-password"
          id="confirm-password-input"
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
      <button
        type="submit"
        class="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Create user
      </button>
    </form>
  </div>
</div>