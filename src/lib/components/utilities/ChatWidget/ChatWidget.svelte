<script lang="ts">
	import { goto } from "$app/navigation";
	import TextInput from "../Form/TextInput.svelte";
	import { onMount, onDestroy } from "svelte";

	let isOpen = $state(false);
	let chatRef = $state<HTMLElement | null>(null);

	function toggleChat() {
		isOpen = !isOpen;
	}

	function toggleFullscreen() {
		goto('/dashboard/aiChat');
	}

	function closeChat() {
		isOpen = false;
	}

	function sendMessage() {
		console.log('Sending message...');
	}

	onMount(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;

			// Si el clic fue fuera del chat y no en el botón de abrir
			if (chatRef && !chatRef.contains(target) && !target.closest('.chat-open-button')) {
				closeChat();
			}
		}

		document.addEventListener("click", handleClickOutside);

		onDestroy(() => {
			document.removeEventListener("click", handleClickOutside);
		});
	});
</script>

<!-- Botón flotante -->
<div class="fixed bottom-6 right-6 z-50">
	<button
		onclick={toggleChat}
		class="chat-open-button w-14 h-14 rounded-full bg-gradient-to-br from-white to-fuchsia-100 text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform duration-200"
		aria-label="Abrir chat"
	>
		<img src="/logo/logo.png" class="w-20 h-22 object-contain" alt="Dashboard" />
	</button>
</div>

<!-- Chat Box -->
{#if isOpen}
	<div
		bind:this={chatRef}
		class="fixed z-50 bg-white shadow-2xl flex flex-col overflow-hidden
			transition-all duration-500 ease-in-out transform-gpu
			bottom-24 right-6 w-[28rem] h-[70vh] rounded-2xl border border-gray-200 scale-100"
	>
		<!-- Header -->
		<div class="flex items-center justify-between px-4 py-3 text-black rounded-xl shadow-md bg-[conic-gradient(at_top_left,_#c7d2fe_0%,_#dbeafe_25%,_#e0e7ff_50%)] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%2020L20%200%22%20stroke%3D%22%23ffffff33%22%20stroke-width%3D%221%22/%3E%3C/svg%3E')] bg-repeat">
			<h2 class="text-lg font-semibold">AI Chat</h2>
			<div class="flex items-center gap-2">
				<button onclick={toggleFullscreen} aria-label="Fullscreen">🔲</button>
				<button onclick={closeChat} aria-label="Close">✖</button>
			</div>
		</div>

		<!-- Chat body -->
		<div class="flex-1 overflow-y-auto p-4 space-y-2 text-sm text-gray-800 bg-gray-50">
			<p class="bg-white p-2 rounded shadow text-sm w-fit">Hola, ¿en qué puedo ayudarte?</p>
		</div>

		<!-- Input -->
		<div class="p-3 bg-white border-t border-gray-200">
			<TextInput placeholder="Write your message..." />
			<button onclick={sendMessage} class="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
		</div>
	</div>
{/if}
