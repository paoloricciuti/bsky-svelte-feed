import fs from 'fs/promises';

export let known_dids_last_read_at: Date | undefined;
export let known_dids: Set<string> | undefined;
export let banned_dids: Set<string> | undefined;
export let banned_dids_last_read_at: Date | undefined;

export let mods_dids: Set<string> | undefined;
export let mods_dids_last_read_at: Date | undefined;

export async function refresh_known_dids() {
	try {
		const stat = await fs.stat('known-dids.json');
		if (
			!known_dids ||
			!known_dids_last_read_at ||
			stat.mtime.getTime() > known_dids_last_read_at.getTime()
		) {
			const known_dids_string = await fs.readFile('known-dids.json', 'utf-8');
			known_dids = new Set(JSON.parse(known_dids_string));
			known_dids_last_read_at = stat.mtime;
			console.log('known dids read at time', stat.mtime.toString());
		}
	} catch {
		console.log('something went wrong reading the known dids file');
	}
}

export async function refresh_banned_dids() {
	try {
		const stat = await fs.stat('banned-dids.json');
		if (
			!banned_dids ||
			!banned_dids_last_read_at ||
			stat.mtime.getTime() > banned_dids_last_read_at.getTime()
		) {
			const banned_dids_string = await fs.readFile('banned-dids.json', 'utf-8');
			banned_dids = new Set(JSON.parse(banned_dids_string));
			banned_dids_last_read_at = stat.mtime;
			console.log('banned dids read at time', stat.mtime.toString());
		}
	} catch {
		console.log('something went wrong reading the banned dids file');
	}
}

export async function refresh_mods_dids() {
	try {
		const stat = await fs.stat('mod-dids.json');
		if (
			!mods_dids ||
			!mods_dids_last_read_at ||
			stat.mtime.getTime() > mods_dids_last_read_at.getTime()
		) {
			const mod_dids_string = await fs.readFile('mod-dids.json', 'utf-8');
			mods_dids = new Set(JSON.parse(mod_dids_string));
			mods_dids_last_read_at = stat.mtime;
			console.log('mod dids read at time', stat.mtime.toString());
		}
	} catch {
		console.log('something went wrong reading the mod dids file');
	}
}
