import * as v from 'valibot';

const BSKY_API = 'https://public.api.bsky.app';

const bsky_response_schema = v.object({
	posts: v.array(
		v.object({
			record: v.object({
				text: v.string(),
				reply: v.optional(
					v.object({
						parent: v.object({ uri: v.string() })
					})
				)
			})
		})
	)
});

export async function get_thread(
	parent_uri: string,
	visited = new Set<string>()
): Promise<string[]> {
	if (visited.has(parent_uri)) return [];
	visited.add(parent_uri);

	const params = new URLSearchParams({ uris: parent_uri });
	const response = await fetch(`${BSKY_API}/xrpc/app.bsky.feed.getPosts?${params}`);
	if (!response.ok) throw new Error(`Could not fetch thread post: ${response.status}`);

	const data = v.parse(bsky_response_schema, await response.json());
	const parent = data.posts[0];
	if (!parent) return [];

	const thread = parent.record.reply
		? await get_thread(parent.record.reply.parent.uri, visited)
		: [];
	return [...thread, parent.record.text];
}
