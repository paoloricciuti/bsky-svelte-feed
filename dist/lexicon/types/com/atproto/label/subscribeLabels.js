import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isLabels(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.label.subscribeLabels#labels');
}
export function validateLabels(v) {
    return lexicons.validate('com.atproto.label.subscribeLabels#labels', v);
}
export function isInfo(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.label.subscribeLabels#info');
}
export function validateInfo(v) {
    return lexicons.validate('com.atproto.label.subscribeLabels#info', v);
}
