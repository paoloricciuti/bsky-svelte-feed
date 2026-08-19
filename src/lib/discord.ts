import { DISCORD_WEBHOOK_URL } from '$app/env/private';

export function post_to_discord(uri: string) {
	if (!DISCORD_WEBHOOK_URL) {
		console.log('posting', uri, 'to discord but DISCORD_WEBHOOK_URL is not set');
		return;
	}
	const url = uri
		?.replace('at://', 'https://bsky.app/profile/')
		.replace('app.bsky.feed.post', 'post');
	return fetch(DISCORD_WEBHOOK_URL + '?wait=true', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			content: `[Open post](${url})`
		})
	}).then((res) => res.json()) as Promise<{ id: string }>;
}

export function delete_from_discord(discord_id: string) {
	if (!DISCORD_WEBHOOK_URL) {
		console.log('deleting', discord_id, 'from discord but DISCORD_WEBHOOK_URL is not set');
		return;
	}
	return fetch(DISCORD_WEBHOOK_URL + `/messages/${discord_id}`, {
		method: 'DELETE'
	});
}
