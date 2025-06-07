import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	callAi: async ({ request }) => {
		const formData = await request.formData();
		const question = formData.get('question')?.toString() ?? '';

		if (!question) return fail(400, { message: 'Question is required' });

		try {
			const res = await fetch('https://inventory-ai-production.up.railway.app', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: question })
			});

			if (!res.ok) return fail(500, { message: 'Backend error' });

			const data = await res.json();

			return {
				success: true,
				answer: data.intent,
				entities: data.entities,
				question
			};
		} catch (e) {
			return fail(500, { message: 'Unexpected error' });
		}
	}
};