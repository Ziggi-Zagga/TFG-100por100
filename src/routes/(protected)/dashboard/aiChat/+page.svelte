<script lang="ts">
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import { fade } from 'svelte/transition';

	type Message = { role: 'user' | 'assistant'; text: string };

	let messages: Message[] = $state([]);
	let inputText = $state('');
	let hasStarted = $state(false);

	const suggestedQuestions = [
		'Low stock products',
		'General inventory statistics',
		'List of suppliers',
		'Total inventory value',
		'Products by category',
		'Latest inventory movements',
		'Recent alerts or incidents'
	];

	async function handleSubmit(event: Event) {
		event.preventDefault();

		const question = inputText.trim();
		if (!question) return;

		hasStarted = true;
		messages = [...messages, { role: 'user', text: question }];

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
			inputText = '';
		} catch (e) {
			messages = [
				...messages,
				{ role: 'assistant', text: 'An error occurred while calling the AI.' }
			];
		}
	}
</script>

<section
	class="flex h-screen w-full"
	style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<div class="flex h-full w-full flex-col items-stretch pr-8 pb-8 pl-8">
		<div
			class="flex h-full w-full flex-grow flex-col justify-between rounded-2xl bg-white p-8 shadow-xl"
		>
			<!-- Cabecera del asistente -->
			<div class="mb-4 flex items-start justify-between">
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-white">
						<img
							src="/icons/svg/robot-svgrepo-com.svg"
							class="h-16 w-13 object-contain"
							alt="Logo"
						/>
					</div>
					<div>
						<h2 class="text-xl font-semibold text-gray-800">AI Assistant</h2>
						<p class="text-sm text-gray-500">Inventory Management System</p>
					</div>
				</div>
				<button class="text-sm text-gray-500 hover:text-red-600">Close conversation ✖</button>
			</div>

			<!-- Centro -->
			{#if !hasStarted}
				<div class="flex flex-grow flex-col items-center justify-center text-center">
					<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white">
						<img src="/logo/logo.png" class="h-40 w-40 object-contain" alt="Logo" />
					</div>
					<h3 class="mb-2 text-lg font-bold text-gray-800">Hello! I'm your AI assistant</h3>
					<p class="max-w-xl text-gray-500">
						I'm here to help you with any question. How can I help you?
					</p>
				</div>
			{:else}
				<div class="mb-4 flex flex-grow flex-col gap-2 overflow-y-auto px-2">
					{#each messages as message}
						<div class={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
							<div
								class={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
							>
								{message.text}
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Footer -->
			<div>
				{#if !hasStarted}
					<div class="mb-4 flex flex-wrap justify-center gap-3">
						{#each suggestedQuestions as question}
							<Button
								variant="tertiary"
								size="md"
								style="border-radius: 2rem; background-color: #fff; border-color: #69c7fa;"
								on:click={() => {
									inputText = question;
									handleSubmit(new Event('submit'));
								}}
							>
								{question}
							</Button>
						{/each}
					</div>
				{/if}

				<div class="border-t border-gray-200 pt-4">
					<form class="flex w-full gap-2" onsubmit={handleSubmit}>
						<div class="w-full">
							<TextInput bind:value={inputText} name="question" placeholder="Ask me anything..." />
						</div>
						<div class="flex items-center justify-center">
							<Button variant="primary" size="md" type="submit">
								<span class="hidden md:inline">></span>
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>
