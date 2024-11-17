import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isProfileViewBasic(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.actor.defs#profileViewBasic');
}
export function validateProfileViewBasic(v) {
    return lexicons.validate('app.bsky.actor.defs#profileViewBasic', v);
}
export function isProfileView(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.actor.defs#profileView');
}
export function validateProfileView(v) {
    return lexicons.validate('app.bsky.actor.defs#profileView', v);
}
export function isProfileViewDetailed(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.actor.defs#profileViewDetailed');
}
export function validateProfileViewDetailed(v) {
    return lexicons.validate('app.bsky.actor.defs#profileViewDetailed', v);
}
export function isViewerState(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.actor.defs#viewerState');
}
export function validateViewerState(v) {
    return lexicons.validate('app.bsky.actor.defs#viewerState', v);
}
export function isAdultContentPref(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.actor.defs#adultContentPref');
}
export function validateAdultContentPref(v) {
    return lexicons.validate('app.bsky.actor.defs#adultContentPref', v);
}
export function isContentLabelPref(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.actor.defs#contentLabelPref');
}
export function validateContentLabelPref(v) {
    return lexicons.validate('app.bsky.actor.defs#contentLabelPref', v);
}
export function isSavedFeedsPref(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.actor.defs#savedFeedsPref');
}
export function validateSavedFeedsPref(v) {
    return lexicons.validate('app.bsky.actor.defs#savedFeedsPref', v);
}
export function isPersonalDetailsPref(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.actor.defs#personalDetailsPref');
}
export function validatePersonalDetailsPref(v) {
    return lexicons.validate('app.bsky.actor.defs#personalDetailsPref', v);
}
export function isFeedViewPref(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.actor.defs#feedViewPref');
}
export function validateFeedViewPref(v) {
    return lexicons.validate('app.bsky.actor.defs#feedViewPref', v);
}
export function isThreadViewPref(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.actor.defs#threadViewPref');
}
export function validateThreadViewPref(v) {
    return lexicons.validate('app.bsky.actor.defs#threadViewPref', v);
}
