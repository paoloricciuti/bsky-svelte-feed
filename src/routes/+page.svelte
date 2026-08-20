<script lang="ts">
	import '@fontsource-variable/bricolage-grotesque';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import {
		approve,
		get_pending_posts,
		logged_in,
		login,
		remove,
		remove_all
	} from './approve.remote';

	let confirming_remove_all = $state(false);
</script>

<svelte:head>
	<title>Approve posts</title>
</svelte:head>

{#if await logged_in()}
	{@const posts = await get_pending_posts()}
	<div class="band">
		<div class="band-inner">
			<hgroup>
				<p class="kicker">svelte feed / moderation</p>
				<h1>Pending</h1>
			</hgroup>
			<div class="band-side">
				<p class="tally"><span class="tally-num">{posts.length}</span> in queue</p>
				<div class="band-actions">
					{#if posts.length > 0}
						{#if confirming_remove_all}
							<form
								{...remove_all.enhance(async ({ submit }) => {
									confirming_remove_all = false;
									if (await submit().updates()) {
										get_pending_posts().set([]);
									}
								})}
							>
								<button class="on-band solid" disabled={!!remove_all.pending}>
									Delete all {posts.length}
								</button>
							</form>
							<button class="on-band" onclick={() => (confirming_remove_all = false)}>Keep</button>
						{:else}
							<button class="on-band" onclick={() => (confirming_remove_all = true)}>
								Delete all
							</button>
						{/if}
					{/if}
					<button class="on-band" onclick={() => get_pending_posts().refresh()}>Refresh</button>
				</div>
			</div>
		</div>
	</div>

	<main>
		{#if posts.length === 0}
			<div class="empty">
				<p class="empty-title">Queue clear.</p>
				<p class="empty-sub">New posts land here as Jetstream picks them up.</p>
			</div>
		{/if}

		<ol class="queue">
			{#each posts as pending, i (pending.uri)}
				<li class="entry" animate:flip={{ duration: 300 }} out:fade={{ duration: 150 }}>
					<span class="index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>

					<article>
						<div class="meta">
							{#if pending.author}
								{#if pending.author.avatar}
									<img class="avatar" src={pending.author.avatar} alt="" />
								{:else}
									<span class="avatar" aria-hidden="true"></span>
								{/if}
								<div class="who">
									<strong>{pending.author.displayName || pending.author.handle}</strong>
									<span class="handle">@{pending.author.handle}</span>
								</div>
							{:else}
								<span class="handle">could not fetch author</span>
							{/if}
							<div class="badges">
								{#if pending.reported}<span class="badge reported">reported</span>{/if}
								{#if !pending.confirmed}<span class="badge unconfirmed">unconfirmed</span>{/if}
							</div>
						</div>

						<p class="text">{pending.text}</p>

						{#if pending.claude_answer}
							<p class="claude"><span class="claude-label">claude</span>{pending.claude_answer}</p>
						{/if}

						<div class="actions">
							<a href={pending.url} target="_blank" rel="noreferrer">Open on Bluesky ↗</a>
							{#if pending.uri}
								{@const approve_post = approve.for(pending.uri)}
								{@const remove_post = remove.for(pending.uri)}
								{@const busy = !!approve_post.pending || !!remove_post.pending}
								{@const remove_from_list = async (
									form: Parameters<Parameters<typeof remove_post.enhance>[0]>[0]
								) => {
									if (await form.submit().updates()) {
										const query = get_pending_posts();
										query.set((query.current ?? []).filter((p) => p.uri !== pending.uri));
									}
								}}
								<form {...remove_post.enhance(remove_from_list)}>
									<input {...remove_post.fields.uri.as('hidden', pending.uri)} />
									<button class="delete" disabled={busy}>Delete</button>
								</form>
								<form {...approve_post.enhance(remove_from_list)}>
									<input {...approve_post.fields.uri.as('hidden', pending.uri)} />
									<button class="approve" disabled={busy}>Approve</button>
								</form>
							{/if}
						</div>
					</article>
				</li>
			{/each}
		</ol>
	</main>
{:else}
	<div class="login-stage">
		<div class="login">
			<p class="kicker">svelte feed / moderation</p>
			<h1 class="login-title">Approve</h1>
			<form {...login}>
				{#each login.fields._password.issues() ?? [] as issue (issue.message)}
					<p class="issue">{issue.message}</p>
				{/each}
				<input
					{...login.fields._password.as('password')}
					placeholder="Approve password"
					autocomplete="current-password"
				/>
				<button class="approve login-btn" disabled={!!login.pending}>Enter</button>
			</form>
		</div>
	</div>
{/if}

<style>
	:global(html) {
		background: oklch(17% 0.012 38);
	}

	:global(body) {
		margin: 0;
		background: oklch(17% 0.012 38);
		color: oklch(90% 0.012 40);
		font-family: 'Bricolage Grotesque Variable', system-ui, sans-serif;
		min-height: 100dvh;
	}

	/* ============ the ember band ============ */

	.band {
		border-top: 4px solid oklch(60% 0.215 33);
		background:
			radial-gradient(50rem 22rem at 18% -8rem, oklch(34% 0.09 33 / 0.5), transparent 70%),
			oklch(19% 0.02 35);
		color: oklch(88% 0.03 40);
	}

	.band-inner {
		max-width: 46rem;
		margin: 0 auto;
		padding: 2.75rem 1.5rem 2rem;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	hgroup {
		margin: 0;
	}

	.kicker {
		margin: 0 0 0.5rem;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: oklch(60% 0.08 38);
	}

	h1 {
		margin: 0;
		font-size: clamp(3rem, 9vw, 4.5rem);
		font-weight: 800;
		letter-spacing: -0.035em;
		line-height: 0.95;
		color: oklch(70% 0.19 38);
	}

	.band-side {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.875rem;
	}

	.tally {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 600;
		color: oklch(62% 0.035 40);
	}

	.tally-num {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 1.5rem;
		font-weight: 700;
		color: oklch(88% 0.05 40);
		margin-right: 0.2rem;
	}

	.band-actions {
		display: flex;
		gap: 0.5rem;
	}

	button.on-band {
		background: transparent;
		border: 1.5px solid oklch(34% 0.03 38);
		color: oklch(80% 0.03 40);
	}

	button.on-band:hover:not(:disabled) {
		border-color: oklch(55% 0.14 38);
		color: oklch(90% 0.06 40);
	}

	button.on-band.solid {
		background: oklch(46% 0.15 27);
		border-color: transparent;
		color: oklch(96% 0.01 25);
	}

	button.on-band.solid:hover:not(:disabled) {
		background: oklch(52% 0.17 27);
	}

	/* ============ the ledger ============ */

	main {
		max-width: 46rem;
		margin: 0 auto;
		padding: 0 1.5rem 6rem;
	}

	.queue {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.entry {
		display: grid;
		grid-template-columns: 3.5rem 1fr;
		gap: 0 1rem;
		padding: 2.25rem 0 2rem;
		border-bottom: 1px solid oklch(27% 0.02 38);
	}

	.index {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 1.6rem;
		font-weight: 300;
		line-height: 1;
		color: oklch(48% 0.11 38);
		padding-top: 0.35rem;
	}

	article {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-width: 0;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.avatar {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background: oklch(28% 0.02 38);
	}

	.who {
		display: flex;
		flex-direction: column;
		line-height: 1.35;
		min-width: 0;
	}

	.who strong {
		font-size: 1rem;
		font-weight: 650;
		color: oklch(94% 0.014 40);
	}

	.handle {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 0.78rem;
		color: oklch(60% 0.035 40);
	}

	.badges {
		margin-left: auto;
		display: flex;
		gap: 0.375rem;
	}

	.badge {
		font-size: 0.66rem;
		font-weight: 650;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.25rem 0.65rem;
		border-radius: 1rem;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.badge::before {
		content: '';
		width: 0.38rem;
		height: 0.38rem;
		border-radius: 50%;
		background: currentColor;
	}

	.badge.reported {
		background: oklch(27% 0.08 25);
		color: oklch(82% 0.13 25);
	}

	.badge.unconfirmed {
		background: oklch(28% 0.055 80);
		color: oklch(85% 0.12 85);
	}

	.text {
		white-space: pre-wrap;
		margin: 0;
		font-size: 1.15rem;
		line-height: 1.55;
		font-weight: 420;
		max-width: 62ch;
		color: oklch(92% 0.012 40);
	}

	.claude {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.55;
		max-width: 62ch;
		color: oklch(66% 0.02 40);
	}

	.claude-label {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 0.66rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: oklch(58% 0.1 38);
		margin-right: 0.65rem;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding-top: 0.25rem;
	}

	.actions a {
		margin-right: auto;
		font-size: 0.85rem;
		font-weight: 550;
		color: oklch(72% 0.14 38);
		text-decoration: none;
	}

	.actions a:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	/* ============ buttons ============ */

	button {
		font: inherit;
		font-size: 0.875rem;
		font-weight: 650;
		padding: 0.5rem 1.1rem;
		border-radius: 2rem;
		border: 1.5px solid transparent;
		cursor: pointer;
		transition:
			background-color 180ms cubic-bezier(0.22, 1, 0.36, 1),
			border-color 180ms cubic-bezier(0.22, 1, 0.36, 1),
			color 180ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 120ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	button:active:not(:disabled) {
		transform: translateY(1px);
	}

	button:focus-visible,
	input:focus-visible {
		outline: 2px solid oklch(70% 0.19 38);
		outline-offset: 2px;
	}

	button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	button.approve {
		background: oklch(60% 0.215 33);
		color: oklch(18% 0.045 33);
	}

	button.approve:hover:not(:disabled) {
		background: oklch(67% 0.2 38);
	}

	button.delete {
		background: transparent;
		border-color: oklch(36% 0.04 30);
		color: oklch(70% 0.06 30);
	}

	button.delete:hover:not(:disabled) {
		background: oklch(24% 0.05 25);
		border-color: oklch(48% 0.1 25);
		color: oklch(78% 0.11 25);
	}

	/* ============ states ============ */

	.empty {
		text-align: center;
		padding: 6rem 0;
	}

	.empty-title {
		margin: 0 0 0.5rem;
		font-size: 2rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: oklch(93% 0.014 40);
	}

	.empty-sub {
		margin: 0;
		font-size: 0.9rem;
		color: oklch(60% 0.035 40);
	}

	.issue {
		margin: 0;
		font-size: 0.875rem;
		color: oklch(76% 0.14 25);
	}

	/* ============ login ============ */

	.login-stage {
		min-height: 100dvh;
		border-top: 4px solid oklch(60% 0.215 33);
		background:
			radial-gradient(50rem 26rem at 50% -10rem, oklch(34% 0.09 33 / 0.5), transparent 70%),
			oklch(17% 0.012 38);
		display: grid;
		place-items: center;
		padding: 1.5rem;
	}

	.login {
		width: min(22rem, 100%);
		margin-top: -8vh;
	}

	.login-title {
		font-size: 3.5rem;
		margin-bottom: 1.75rem;
	}

	.login form {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	input {
		font: inherit;
		padding: 0.7rem 0.9rem;
		border-radius: 0.75rem;
		border: 1.5px solid oklch(32% 0.022 38);
		background: oklch(21% 0.015 38);
		color: oklch(92% 0.012 40);
	}

	input::placeholder {
		color: oklch(52% 0.02 40);
	}

	button.login-btn {
		padding: 0.7rem;
	}

	@media (max-width: 32rem) {
		.entry {
			grid-template-columns: 1fr;
		}

		.index {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}
</style>
