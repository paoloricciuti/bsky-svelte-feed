import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isMain(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'app.bsky.embed.external#main' ||
            v.$type === 'app.bsky.embed.external'));
}
export function validateMain(v) {
    return lexicons.validate('app.bsky.embed.external#main', v);
}
export function isExternal(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.embed.external#external');
}
export function validateExternal(v) {
    return lexicons.validate('app.bsky.embed.external#external', v);
}
export function isView(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.embed.external#view');
}
export function validateView(v) {
    return lexicons.validate('app.bsky.embed.external#view', v);
}
export function isViewExternal(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.embed.external#viewExternal');
}
export function validateViewExternal(v) {
    return lexicons.validate('app.bsky.embed.external#viewExternal', v);
}
