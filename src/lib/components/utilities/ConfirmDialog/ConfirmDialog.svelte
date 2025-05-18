<script>
    import Button from "$lib/components/utilities/Button/Button.svelte";
    export let productName = "";
    export let message = "Are you sure?";
    export let onConfirm = () => {};
    export let onCancel = () => {};
    export let show = false;
  
    const handleConfirm = () => onConfirm();
    const handleCancel = () => onCancel();
  </script>
  
  {#if show}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        <p class="mb-6 text-lg font-medium">{message}</p>
        <div class="flex justify-center gap-4">
          <Button
            variant="secondary"
            size="md"
            extraStyles="w-full md:w-auto"
            onclick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            extraStyles="w-full md:w-auto"
            onclick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  {/if}
  