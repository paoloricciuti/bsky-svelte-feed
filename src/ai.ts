import Anthropic from '@anthropic-ai/sdk';

class PipelineSingleton {
	static instance: Anthropic;

	static async get() {
		if (this.instance === null) {
			this.instance = new Anthropic();
		}
		return this.instance;
	}
}

export async function check(message: string) {
	try {
		const classifier = await PipelineSingleton.get();
		const res = await classifier.messages.create({
			model: 'claude-3-5-haiku-20241022',
			max_tokens: 1000,
			temperature: 0,
			system:
				'You need to determine i a tweet is about svelte the framework. Answer with a single 0 (in case it is not) or 1 in case it is.',
			messages: [
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: 'This cat looks svelte',
						},
					],
				},
			],
		});
		return res.content[0].type === 'text' && res.content[0].text === '1';
	} catch {
		return true;
	}
}
