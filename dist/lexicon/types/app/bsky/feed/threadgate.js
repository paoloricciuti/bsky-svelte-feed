import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isRecord(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'app.bsky.feed.threadgate#main' ||
            v.$type === 'app.bsky.feed.threadgate'));
}
export function validateRecord(v) {
    return lexicons.validate('app.bsky.feed.threadgate#main', v);
}
export function isMentionRule(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.threadgate#mentionRule');
}
export function validateMentionRule(v) {
    return lexicons.validate('app.bsky.feed.threadgate#mentionRule', v);
}
export function isFollowingRule(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.threadgate#followingRule');
}
export function validateFollowingRule(v) {
    return lexicons.validate('app.bsky.feed.threadgate#followingRule', v);
}
export function isListRule(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.threadgate#listRule');
}
export function validateListRule(v) {
    return lexicons.validate('app.bsky.feed.threadgate#listRule', v);
}
