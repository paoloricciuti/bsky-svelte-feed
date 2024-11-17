import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isMain(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        (v.$type === 'com.atproto.repo.strongRef#main' ||
            v.$type === 'com.atproto.repo.strongRef'));
}
export function validateMain(v) {
    return lexicons.validate('com.atproto.repo.strongRef#main', v);
}
