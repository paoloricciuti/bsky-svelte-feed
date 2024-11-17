import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isActionView(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#actionView');
}
export function validateActionView(v) {
    return lexicons.validate('com.atproto.admin.defs#actionView', v);
}
export function isActionViewDetail(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#actionViewDetail');
}
export function validateActionViewDetail(v) {
    return lexicons.validate('com.atproto.admin.defs#actionViewDetail', v);
}
export function isActionViewCurrent(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#actionViewCurrent');
}
export function validateActionViewCurrent(v) {
    return lexicons.validate('com.atproto.admin.defs#actionViewCurrent', v);
}
export function isActionReversal(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#actionReversal');
}
export function validateActionReversal(v) {
    return lexicons.validate('com.atproto.admin.defs#actionReversal', v);
}
/** Moderation action type: Takedown. Indicates that content should not be served by the PDS. */
export const TAKEDOWN = 'com.atproto.admin.defs#takedown';
/** Moderation action type: Flag. Indicates that the content was reviewed and considered to violate PDS rules, but may still be served. */
export const FLAG = 'com.atproto.admin.defs#flag';
/** Moderation action type: Acknowledge. Indicates that the content was reviewed and not considered to violate PDS rules. */
export const ACKNOWLEDGE = 'com.atproto.admin.defs#acknowledge';
/** Moderation action type: Escalate. Indicates that the content has been flagged for additional review. */
export const ESCALATE = 'com.atproto.admin.defs#escalate';
export function isReportView(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#reportView');
}
export function validateReportView(v) {
    return lexicons.validate('com.atproto.admin.defs#reportView', v);
}
export function isReportViewDetail(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#reportViewDetail');
}
export function validateReportViewDetail(v) {
    return lexicons.validate('com.atproto.admin.defs#reportViewDetail', v);
}
export function isRepoView(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#repoView');
}
export function validateRepoView(v) {
    return lexicons.validate('com.atproto.admin.defs#repoView', v);
}
export function isRepoViewDetail(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#repoViewDetail');
}
export function validateRepoViewDetail(v) {
    return lexicons.validate('com.atproto.admin.defs#repoViewDetail', v);
}
export function isRepoViewNotFound(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#repoViewNotFound');
}
export function validateRepoViewNotFound(v) {
    return lexicons.validate('com.atproto.admin.defs#repoViewNotFound', v);
}
export function isRepoRef(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#repoRef');
}
export function validateRepoRef(v) {
    return lexicons.validate('com.atproto.admin.defs#repoRef', v);
}
export function isRecordView(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#recordView');
}
export function validateRecordView(v) {
    return lexicons.validate('com.atproto.admin.defs#recordView', v);
}
export function isRecordViewDetail(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#recordViewDetail');
}
export function validateRecordViewDetail(v) {
    return lexicons.validate('com.atproto.admin.defs#recordViewDetail', v);
}
export function isRecordViewNotFound(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#recordViewNotFound');
}
export function validateRecordViewNotFound(v) {
    return lexicons.validate('com.atproto.admin.defs#recordViewNotFound', v);
}
export function isModeration(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#moderation');
}
export function validateModeration(v) {
    return lexicons.validate('com.atproto.admin.defs#moderation', v);
}
export function isModerationDetail(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#moderationDetail');
}
export function validateModerationDetail(v) {
    return lexicons.validate('com.atproto.admin.defs#moderationDetail', v);
}
export function isBlobView(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#blobView');
}
export function validateBlobView(v) {
    return lexicons.validate('com.atproto.admin.defs#blobView', v);
}
export function isImageDetails(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#imageDetails');
}
export function validateImageDetails(v) {
    return lexicons.validate('com.atproto.admin.defs#imageDetails', v);
}
export function isVideoDetails(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'com.atproto.admin.defs#videoDetails');
}
export function validateVideoDetails(v) {
    return lexicons.validate('com.atproto.admin.defs#videoDetails', v);
}
