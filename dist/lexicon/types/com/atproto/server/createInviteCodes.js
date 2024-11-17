import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isAccountCodes(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.server.createInviteCodes#accountCodes');
}
export function validateAccountCodes(v) {
    return lexicons.validate('com.atproto.server.createInviteCodes#accountCodes', v);
}
