<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { goto } from "$app/navigation";
	import TextInput from "../Form/TextInput.svelte";
	import Button from "../Button/Button.svelte";

	type Message = { role: 'user' | 'assistant'; text: string };

	let isOpen = $state(false);
	let chatRef = $state<HTMLElement | null>(null);
	let inputText = $state('');
	let hasStarted = $state(false);
	let messages: Message[] = $state([]);

	let chatScrollRef = $state<HTMLDivElement | null>(null);

	function toggleChat() {
		isOpen = !isOpen;
	}

	function toggleFullscreen() {
		goto('/dashboard/aiChat');
	}

	function closeChat() {
		isOpen = false;
	}

	async function handleSubmit() {
		const question = inputText.trim();
		if (!question) return;

		hasStarted = true;
		messages = [...messages, { role: 'user', text: question }];
		inputText = '';

		try {
			const res = await fetch('https://inventory-ai-production.up.railway.app/interpret', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: question })
			});

			if (!res.ok) throw new Error('Backend error');

			const data = await res.json();
			messages = [
				...messages,
				{
					role: 'assistant',
					text: `Intent: ${data.intent}\nEntities:\n${data.entities?.map((e: any) => `${e.entity}: ${e.text}`).join(', ')}`
				}
			];
		} catch {
			messages = [...messages, { role: 'assistant', text: 'An error occurred while calling the AI.' }];
		}
	}

	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (chatRef && !chatRef.contains(target) && !target.closest('.chat-open-button')) {
				closeChat();
			}
		};

		document.addEventListener("click", handleClickOutside);
		onDestroy(() => document.removeEventListener("click", handleClickOutside));
	});

</script>

<!-- Botón flotante -->
<div class="fixed bottom-6 right-6 z-50">
	<button
		onclick={toggleChat}
		class="chat-open-button w-14 h-14 rounded-full bg-gradient-to-br from-white to-fuchsia-100 shadow-xl flex items-center justify-center hover:scale-105 transition-transform duration-200"
		aria-label="Abrir chat"
	>
		<img src="/logo/logo.png" class="w-20 h-20 object-contain" alt="Dashboard" />
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
		<div class="flex items-center justify-between px-4 py-3 text-black rounded-xl shadow-md bg-gradient-to-r from-blue-100 to-purple-100">
			<h2 class="text-lg font-semibold">AI Chat</h2>
			<div class="flex items-center gap-2">
				<button onclick={toggleFullscreen} aria-label="Fullscreen">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4h4M16 4h4v4M4 16v4h4m12-4v4h-4" />
					</svg>
				</button>
				<button onclick={closeChat} aria-label="Close">✖</button>
			</div>
		</div>

		<!-- Chat body -->
		<div class="flex-1 overflow-y-auto p-4 space-y-2 text-sm bg-gray-50" bind:this={chatScrollRef}>
			{#if !hasStarted}
				<p class="text-center text-gray-400">Hi there!<br />Ask me anything about your inventory!</p>
			{:else}
				{#each messages as message}
					<div class={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
						<div class={`max-w-[70%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
							{message.text}
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Input -->
		<div class="p-3 bg-white border-t border-gray-200 flex gap-2 items-center">
			<div class="flex-grow">
				<TextInput bind:value={inputText} placeholder="Write your message..." />
			</div>
			<Button onclick={handleSubmit} variant="primary" size="md">
				&gt;
			</Button>
		</div>
	</div>
{/if}
