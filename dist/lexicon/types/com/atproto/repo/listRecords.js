import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isRecord(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.repo.listRecords#record');
}
export function validateRecord(v) {
    return lexicons.validate('com.atproto.repo.listRecords#record', v);
}
