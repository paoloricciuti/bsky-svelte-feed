import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isRecord(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'app.bsky.feed.post#main' || v.$type === 'app.bsky.feed.post'));
}
export function validateRecord(v) {
    return lexicons.validate('app.bsky.feed.post#main', v);
}
export function isReplyRef(v) {
    return (isObj(v) && hasProp(v, '$type') && v.$type === 'app.bsky.feed.post#replyRef');
}
export function validateReplyRef(v) {
    return lexicons.validate('app.bsky.feed.post#replyRef', v);
}
export function isEntity(v) {
    return (isObj(v) && hasProp(v, '$type') && v.$type === 'app.bsky.feed.post#entity');
}
export function validateEntity(v) {
    return lexicons.validate('app.bsky.feed.post#entity', v);
}
export function isTextSlice(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.post#textSlice');
}
export function validateTextSlice(v) {
    return lexicons.validate('app.bsky.feed.post#textSlice', v);
}
