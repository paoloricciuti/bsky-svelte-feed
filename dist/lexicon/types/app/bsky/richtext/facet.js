import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isMain(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'app.bsky.richtext.facet#main' ||
            v.$type === 'app.bsky.richtext.facet'));
}
export function validateMain(v) {
    return lexicons.validate('app.bsky.richtext.facet#main', v);
}
export function isMention(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.richtext.facet#mention');
}
export function validateMention(v) {
    return lexicons.validate('app.bsky.richtext.facet#mention', v);
}
export function isLink(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.richtext.facet#link');
}
export function validateLink(v) {
    return lexicons.validate('app.bsky.richtext.facet#link', v);
}
export function isTag(v) {
    return (isObj(v) && hasProp(v, '$type') && v.$type === 'app.bsky.richtext.facet#tag');
}
export function validateTag(v) {
    return lexicons.validate('app.bsky.richtext.facet#tag', v);
}
export function isByteSlice(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.richtext.facet#byteSlice');
}
export function validateByteSlice(v) {
    return lexicons.validate('app.bsky.richtext.facet#byteSlice', v);
}
