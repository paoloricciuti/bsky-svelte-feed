import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isListViewBasic(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.graph.defs#listViewBasic');
}
export function validateListViewBasic(v) {
    return lexicons.validate('app.bsky.graph.defs#listViewBasic', v);
}
export function isListView(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.graph.defs#listView');
}
export function validateListView(v) {
    return lexicons.validate('app.bsky.graph.defs#listView', v);
}
export function isListItemView(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.graph.defs#listItemView');
}
export function validateListItemView(v) {
    return lexicons.validate('app.bsky.graph.defs#listItemView', v);
}
/** A list of actors to apply an aggregate moderation action (mute/block) on */
export const MODLIST = 'app.bsky.graph.defs#modlist';
/** A list of actors used for curation purposes such as list feeds or interaction gating */
export const CURATELIST = 'app.bsky.graph.defs#curatelist';
export function isListViewerState(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.graph.defs#listViewerState');
}
export function validateListViewerState(v) {
    return lexicons.validate('app.bsky.graph.defs#listViewerState', v);
}
