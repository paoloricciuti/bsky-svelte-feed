import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({});
const msg = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1000,
    temperature: 0,
    system: 'You need to determine i a tweet is about svelte the framework. Answer with a single 0 (in case it is not) or 1 in case it is.',
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
console.log(msg);
