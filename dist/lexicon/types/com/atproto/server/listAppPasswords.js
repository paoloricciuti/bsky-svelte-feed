import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isAppPassword(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.server.listAppPasswords#appPassword');
}
export function validateAppPassword(v) {
    return lexicons.validate('com.atproto.server.listAppPasswords#appPassword', v);
}
