import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isMain(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'app.bsky.embed.images#main' ||
            v.$type === 'app.bsky.embed.images'));
}
export function validateMain(v) {
    return lexicons.validate('app.bsky.embed.images#main', v);
}
export function isImage(v) {
    return (isObj(v) && hasProp(v, '$type') && v.$type === 'app.bsky.embed.images#image');
}
export function validateImage(v) {
    return lexicons.validate('app.bsky.embed.images#image', v);
}
export function isAspectRatio(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.embed.images#aspectRatio');
}
export function validateAspectRatio(v) {
    return lexicons.validate('app.bsky.embed.images#aspectRatio', v);
}
export function isView(v) {
    return (isObj(v) && hasProp(v, '$type') && v.$type === 'app.bsky.embed.images#view');
}
export function validateView(v) {
    return lexicons.validate('app.bsky.embed.images#view', v);
}
export function isViewImage(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.embed.images#viewImage');
}
export function validateViewImage(v) {
    return lexicons.validate('app.bsky.embed.images#viewImage', v);
}
