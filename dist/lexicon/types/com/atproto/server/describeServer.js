import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isLinks(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.server.describeServer#links');
}
export function validateLinks(v) {
    return lexicons.validate('com.atproto.server.describeServer#links', v);
}
