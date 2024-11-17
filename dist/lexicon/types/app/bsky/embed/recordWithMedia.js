import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isMain(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'app.bsky.embed.recordWithMedia#main' ||
            v.$type === 'app.bsky.embed.recordWithMedia'));
}
export function validateMain(v) {
    return lexicons.validate('app.bsky.embed.recordWithMedia#main', v);
}
export function isView(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.embed.recordWithMedia#view');
}
export function validateView(v) {
    return lexicons.validate('app.bsky.embed.recordWithMedia#view', v);
}
