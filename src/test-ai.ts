import { check } from './ai.js';

console.log(
	await check(
		`Ok this was probably expected...but i do love thas svelte allow me to build something very fast
		<bio>S1 | Developer | sveltelab.dev |  Fat guy | Svelte Ambassador 🔶 | Svelte maintainer 🧡</bio>`,
	),
);

console.log(await check('svelte is the best thing after angularjs'));
console.log(
	await check(`Saw 

(but didn’t saw my own svelte-related post 😢😅 <bio>Tea & beer drinker, dad of 2 △ web(UI, dev, engineering), dataviz, AI, biology (proteins/antibodies)+ slackline, photo, music, etc. △

Formerly: x.com/0gust1

More personal and up-to-date:
mastodon instance: merveilles.town/@0gust1</bio>`),
);

console.log(await check('this cat looks so svelte <bio>i love cats</bio>'));
console.log(
	await check(
		"There's the brick, sitting under the tape machine. For such a svelte machine, it's absolutely huge. And heavy. And sharp. The sad little sticker on the machine itself sums up Newbrain ownership to me ... <bio>Also known as @herebedragons3 on the other site.</bio>",
	),
);
