import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isRecord(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'app.bsky.graph.follow#main' ||
            v.$type === 'app.bsky.graph.follow'));
}
export function validateRecord(v) {
    return lexicons.validate('app.bsky.graph.follow#main', v);
}
