import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isRecord(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'app.bsky.feed.generator#main' ||
            v.$type === 'app.bsky.feed.generator'));
}
export function validateRecord(v) {
    return lexicons.validate('app.bsky.feed.generator#main', v);
}
