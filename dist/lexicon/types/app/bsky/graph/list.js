import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isRecord(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'app.bsky.graph.list#main' ||
            v.$type === 'app.bsky.graph.list'));
}
export function validateRecord(v) {
    return lexicons.validate('app.bsky.graph.list#main', v);
}
