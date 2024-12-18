import Anthropic from '@anthropic-ai/sdk';

class PipelineSingleton {
	static instance: Anthropic;

	static async get() {
		if (this.instance == null) {
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
			system: `Classify whether the following tweet is about the web framework Svelte or its metaframework SvelteKit. 

<examples>
Tweet: oh my god i love svelte
Answer: yes

Tweet: my cat is so slick and svelte
Answer: no

Tweet: svelte just reached 80k stars on github
Answer: yes

Tweet: brousse is portrayed as a person who is, svelte and thin with strong prescription glasses.
Answer: no

Tweet: actually, all three band members are usually quite svelte.
Answer: no

Tweet: after arriving at the lodge, the group is greeted by a svelte, attractive blonde women.
Answer: no

Tweet: this character is younger and more svelte than the original version and appears to possess wind-based powers.
Answer: no

Tweet: i've decided to learn svelte
Answer: yes

Tweet: just found out about svelte...it's soo cool
Answer: yes

Tweet: i used to like svelte but i'm not sure about the new version
Answer: yes

Tweet: look at what i did with svelte
Answer: yes
</examples>

When the user asks they will write single tweet and your answer needs to either \`yes\` or \`no\``,
			messages: [
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: `Tweet: ${message}
Answer: `,
						},
					],
				},
			],
		});
		return {
			result: res.content[0].type === 'text' && res.content[0].text === 'yes',
			text:
				res.content[0].type === 'text'
					? res.content[0].text
					: 'not text answer',
		};
	} catch (e) {
		console.log('error with ai', e);
		return { result: true, text: 'not text answer (error)' };
	}
}
