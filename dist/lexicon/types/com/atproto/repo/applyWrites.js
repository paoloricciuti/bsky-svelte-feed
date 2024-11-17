import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isCreate(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.repo.applyWrites#create');
}
export function validateCreate(v) {
    return lexicons.validate('com.atproto.repo.applyWrites#create', v);
}
export function isUpdate(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.repo.applyWrites#update');
}
export function validateUpdate(v) {
    return lexicons.validate('com.atproto.repo.applyWrites#update', v);
}
export function isDelete(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.repo.applyWrites#delete');
}
export function validateDelete(v) {
    return lexicons.validate('com.atproto.repo.applyWrites#delete', v);
}
