import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isRepo(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.sync.listRepos#repo');
}
export function validateRepo(v) {
    return lexicons.validate('com.atproto.sync.listRepos#repo', v);
}
