import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isRecord(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'app.bsky.graph.listitem#main' ||
            v.$type === 'app.bsky.graph.listitem'));
}
export function validateRecord(v) {
    return lexicons.validate('app.bsky.graph.listitem#main', v);
}
