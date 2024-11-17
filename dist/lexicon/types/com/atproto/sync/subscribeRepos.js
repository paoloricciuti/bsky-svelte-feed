import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isCommit(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.sync.subscribeRepos#commit');
}
export function validateCommit(v) {
    return lexicons.validate('com.atproto.sync.subscribeRepos#commit', v);
}
export function isHandle(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.sync.subscribeRepos#handle');
}
export function validateHandle(v) {
    return lexicons.validate('com.atproto.sync.subscribeRepos#handle', v);
}
export function isMigrate(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.sync.subscribeRepos#migrate');
}
export function validateMigrate(v) {
    return lexicons.validate('com.atproto.sync.subscribeRepos#migrate', v);
}
export function isTombstone(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.sync.subscribeRepos#tombstone');
}
export function validateTombstone(v) {
    return lexicons.validate('com.atproto.sync.subscribeRepos#tombstone', v);
}
export function isInfo(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.sync.subscribeRepos#info');
}
export function validateInfo(v) {
    return lexicons.validate('com.atproto.sync.subscribeRepos#info', v);
}
export function isRepoOp(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.sync.subscribeRepos#repoOp');
}
export function validateRepoOp(v) {
    return lexicons.validate('com.atproto.sync.subscribeRepos#repoOp', v);
}
