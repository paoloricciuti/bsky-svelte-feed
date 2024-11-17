import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isMain(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'app.bsky.embed.record#main' ||
            v.$type === 'app.bsky.embed.record'));
}
export function validateMain(v) {
    return lexicons.validate('app.bsky.embed.record#main', v);
}
export function isView(v) {
    return (isObj(v) && hasProp(v, '$type') && v.$type === 'app.bsky.embed.record#view');
}
export function validateView(v) {
    return lexicons.validate('app.bsky.embed.record#view', v);
}
export function isViewRecord(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.embed.record#viewRecord');
}
export function validateViewRecord(v) {
    return lexicons.validate('app.bsky.embed.record#viewRecord', v);
}
export function isViewNotFound(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.embed.record#viewNotFound');
}
export function validateViewNotFound(v) {
    return lexicons.validate('app.bsky.embed.record#viewNotFound', v);
}
export function isViewBlocked(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.embed.record#viewBlocked');
}
export function validateViewBlocked(v) {
    return lexicons.validate('app.bsky.embed.record#viewBlocked', v);
}
