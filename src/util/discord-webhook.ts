export function post_to_discord(uri: string) {
	if (!process.env.DISCORD_WEBHOOK_URL) return;
	const url = uri
		?.replace('at://', 'https://bsky.app/profile/')
		.replace('app.bsky.feed.post', 'post');
	return fetch(process.env.DISCORD_WEBHOOK_URL + '?wait=true', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			content: `[Open post](${url})`,
		}),
	}).then((res) => res.json()) as Promise<{ id: string }>;
}

export function delete_from_discord(discord_id: string) {
	if (!process.env.DISCORD_WEBHOOK_URL) return;
	return fetch(process.env.DISCORD_WEBHOOK_URL + `/${discord_id}`, {
		method: 'DELETE',
	}).then((res) => res.json());
}
