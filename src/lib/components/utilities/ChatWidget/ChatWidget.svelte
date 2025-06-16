<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import TextInput from '../Form/TextInput.svelte';
	import Button from '../Button/Button.svelte';

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
			messages = [
				...messages,
				{ role: 'assistant', text: 'An error occurred while calling the AI.' }
			];
		}
	}

	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (chatRef && !chatRef.contains(target) && !target.closest('.chat-open-button')) {
				closeChat();
			}
		};

		document.addEventListener('click', handleClickOutside);
		onDestroy(() => document.removeEventListener('click', handleClickOutside));
	});
</script>

<div class="fixed right-6 bottom-6 z-50">
	<button
		onclick={toggleChat}
		class="chat-open-button flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-white to-fuchsia-100 shadow-xl transition-transform duration-200 hover:scale-105"
		aria-label="Abrir chat"
	>
		<img src="/logo/logo.png" class="h-20 w-20 object-contain" alt="Dashboard" />
	</button>
</div>

{#if isOpen}
	<div
		bind:this={chatRef}
		class="fixed right-6 bottom-24 z-50 flex h-[70vh] w-[28rem]
			scale-100 transform-gpu flex-col overflow-hidden
			rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-500 ease-in-out"
	>
		<div
			class="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-3 text-black shadow-md"
		>
			<h2 class="text-lg font-semibold">AI Chat</h2>
			<div class="flex items-center gap-2">
				<button onclick={toggleFullscreen} aria-label="Fullscreen">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 8V4h4M16 4h4v4M4 16v4h4m12-4v4h-4"
						/>
					</svg>
				</button>
				<button onclick={closeChat} aria-label="Close">✖</button>
			</div>
		</div>

		<div class="flex-1 space-y-2 overflow-y-auto bg-gray-50 p-4 text-sm" bind:this={chatScrollRef}>
			{#if !hasStarted}
				<p class="text-center text-gray-400">
					Hi there!<br />Ask me anything about your inventory!
				</p>
			{:else}
				{#each messages as message}
					<div class={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
						<div
							class={`max-w-[70%] rounded-2xl px-4 py-2 text-sm whitespace-pre-line ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
						>
							{message.text}
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<div class="flex items-center gap-2 border-t border-gray-200 bg-white p-3">
			<div class="flex-grow">
				<TextInput bind:value={inputText} placeholder="Write your message..." />
			</div>
			<Button onclick={handleSubmit} variant="primary" size="md">&gt;</Button>
		</div>
	</div>
{/if}
