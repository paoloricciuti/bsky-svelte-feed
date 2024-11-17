import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isInviteCode(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.server.defs#inviteCode');
}
export function validateInviteCode(v) {
    return lexicons.validate('com.atproto.server.defs#inviteCode', v);
}
export function isInviteCodeUse(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.server.defs#inviteCodeUse');
}
export function validateInviteCodeUse(v) {
    return lexicons.validate('com.atproto.server.defs#inviteCodeUse', v);
}
