import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isFeed(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.describeFeedGenerator#feed');
}
export function validateFeed(v) {
    return lexicons.validate('app.bsky.feed.describeFeedGenerator#feed', v);
}
export function isLinks(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.describeFeedGenerator#links');
}
export function validateLinks(v) {
    return lexicons.validate('app.bsky.feed.describeFeedGenerator#links', v);
}
