import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isLike(v) {
    return (isObj(v) && hasProp(v, '$type') && v.$type === 'app.bsky.feed.getLikes#like');
}
export function validateLike(v) {
    return lexicons.validate('app.bsky.feed.getLikes#like', v);
}
