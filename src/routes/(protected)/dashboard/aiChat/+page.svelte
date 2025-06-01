<script lang="ts">
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import { goto } from '$app/navigation';

	const suggestedQuestions = [
		'Ver productos con stock bajo',
		'Ver estadísticas generales del inventario',
		'Ver lista de proveedores',
		'Consultar valor total del inventario',
		'Ver productos por categoría',
		'Ver últimos movimientos de inventario',
		'Ver alertas o incidencias recientes'
	];

	function sendMessage() {
		console.log('Mensaje enviado');
	}

	function startNewChat() {
		console.log('Nueva conversación');
	}
</script>

<!-- Contenedor principal centrado en el layout -->
<div class="p-8 w-full h-full flex flex-col items-center justify-start">
	<!-- Card blanca con borde redondeado -->
	<div class="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-6">
		
		<!-- Cabecera del asistente -->
		<div class="flex justify-between items-start">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
					<img src="/icons/svg/robot.svg" alt="IA" class="w-6 h-6" />
				</div>
				<div>
					<h2 class="text-xl font-semibold text-gray-800">Asistente IA</h2>
					<p class="text-sm text-gray-500">Sistema de inventario SVT</p>
				</div>
			</div>

			<button class="text-sm text-gray-500 hover:text-red-600" onclick={startNewChat}>
				Nueva conversación ✖
			</button>
		</div>

		<!-- Mensaje de bienvenida -->
		<div class="flex flex-col items-center text-center mt-4 mb-6">
			<div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
				<img src="/icons/svg/sparkle.svg" alt="IA" class="w-5 h-5" />
			</div>
			<h3 class="text-lg font-bold text-gray-800 mb-2">¡Hola! Soy tu asistente IA</h3>
			<p class="text-gray-500 max-w-xl">
				Estoy aquí para ayudarte con cualquier pregunta sobre el sistema de inventario SVT.
				¿En qué puedo ayudarte hoy?
			</p>
		</div>

		<!-- Sugerencias rápidas -->
		<div class="flex flex-wrap gap-3 justify-center mb-2">
			{#each suggestedQuestions as question}
				<button
					class="px-4 py-2 text-sm rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition"
					onclick={() => console.log('Sugerencia clicada:', question)}
				>
					{question}
				</button>
			{/each}
		</div>

		<!-- Input + enviar -->
		<div class="pt-4 border-t border-gray-200 flex items-center gap-2">
			<TextInput class="flex-1" placeholder="Escribe tu pregunta aquí..." />
			<button
				class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full transition"
				onclick={sendMessage}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10l9-6 9 6-9 6-9-6z" />
				</svg>
			</button>
		</div>
	</div>
</div>
