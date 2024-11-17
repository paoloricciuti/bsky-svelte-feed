import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isRecord(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'app.bsky.graph.listblock#main' ||
            v.$type === 'app.bsky.graph.listblock'));
}
export function validateRecord(v) {
    return lexicons.validate('app.bsky.graph.listblock#main', v);
}
