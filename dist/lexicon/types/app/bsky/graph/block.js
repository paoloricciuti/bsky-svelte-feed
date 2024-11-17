import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isRecord(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'app.bsky.graph.block#main' ||
            v.$type === 'app.bsky.graph.block'));
}
export function validateRecord(v) {
    return lexicons.validate('app.bsky.graph.block#main', v);
}
