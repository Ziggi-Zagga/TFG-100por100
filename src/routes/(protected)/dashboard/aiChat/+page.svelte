<script lang="ts">
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';

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
			messages = [...messages, { role: 'assistant', text: 'An error occurred while calling the AI.' }];
		}
	}
</script>

<section class="h-screen w-full flex" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
	<div class="pl-8 pb-8 pr-8 w-full h-full flex flex-col items-stretch">
		<div class="w-full h-full flex-grow bg-white shadow-xl rounded-2xl p-8 flex flex-col justify-between">
			<!-- Cabecera del asistente -->
			<div class="flex justify-between items-start mb-4">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
						<img src="/icons/svg/robot-svgrepo-com.svg" class="w-13 h-16 object-contain" alt="Logo" />
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
				<div class="flex flex-col items-center text-center justify-center flex-grow">
					<div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3">
						<img src="/logo/logo.png" class="w-40 h-40 object-contain" alt="Logo" />
					</div>
					<h3 class="text-lg font-bold text-gray-800 mb-2">Hello! I'm your AI assistant</h3>
					<p class="text-gray-500 max-w-xl">I'm here to help you with any question. How can I help you?</p>
				</div>
			{:else}
				<div class="flex flex-col gap-2 overflow-y-auto flex-grow px-2 mb-4">
					{#each messages as message}
						<div class={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
							<div class={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
								{message.text}
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Footer -->
			<div>
				{#if !hasStarted}
					<div class="flex flex-wrap gap-3 justify-center mb-4">
						{#each suggestedQuestions as question}
							<Button variant="tertiary" size="md" style="border-radius: 2rem; background-color: #fff; border-color: #69c7fa;" on:click={() => { inputText = question; handleSubmit(new Event('submit')); }}>
								{question}
							</Button>
						{/each}
					</div>
				{/if}

				<div class="pt-4 border-t border-gray-200">
					<form class="flex gap-2 w-full" onsubmit={handleSubmit}>
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
