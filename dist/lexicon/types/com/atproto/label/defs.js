import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isLabel(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.label.defs#label');
}
export function validateLabel(v) {
    return lexicons.validate('com.atproto.label.defs#label', v);
}
export function isSelfLabels(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.label.defs#selfLabels');
}
export function validateSelfLabels(v) {
    return lexicons.validate('com.atproto.label.defs#selfLabels', v);
}
export function isSelfLabel(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.label.defs#selfLabel');
}
export function validateSelfLabel(v) {
    return lexicons.validate('com.atproto.label.defs#selfLabel', v);
}
