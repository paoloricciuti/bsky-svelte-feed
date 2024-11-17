import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isSkeletonSearchPost(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.unspecced.defs#skeletonSearchPost');
}
export function validateSkeletonSearchPost(v) {
    return lexicons.validate('app.bsky.unspecced.defs#skeletonSearchPost', v);
}
export function isSkeletonSearchActor(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.unspecced.defs#skeletonSearchActor');
}
export function validateSkeletonSearchActor(v) {
    return lexicons.validate('app.bsky.unspecced.defs#skeletonSearchActor', v);
}
