import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isRecord(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'app.bsky.actor.profile#main' ||
            v.$type === 'app.bsky.actor.profile'));
}
export function validateRecord(v) {
    return lexicons.validate('app.bsky.actor.profile#main', v);
}
