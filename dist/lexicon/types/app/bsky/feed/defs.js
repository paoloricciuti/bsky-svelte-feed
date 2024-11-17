import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isPostView(v) {
    return (isObj(v) && hasProp(v, '$type') && v.$type === 'app.bsky.feed.defs#postView');
}
export function validatePostView(v) {
    return lexicons.validate('app.bsky.feed.defs#postView', v);
}
export function isViewerState(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.defs#viewerState');
}
export function validateViewerState(v) {
    return lexicons.validate('app.bsky.feed.defs#viewerState', v);
}
export function isFeedViewPost(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.defs#feedViewPost');
}
export function validateFeedViewPost(v) {
    return lexicons.validate('app.bsky.feed.defs#feedViewPost', v);
}
export function isReplyRef(v) {
    return (isObj(v) && hasProp(v, '$type') && v.$type === 'app.bsky.feed.defs#replyRef');
}
export function validateReplyRef(v) {
    return lexicons.validate('app.bsky.feed.defs#replyRef', v);
}
export function isReasonRepost(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.defs#reasonRepost');
}
export function validateReasonRepost(v) {
    return lexicons.validate('app.bsky.feed.defs#reasonRepost', v);
}
export function isThreadViewPost(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.defs#threadViewPost');
}
export function validateThreadViewPost(v) {
    return lexicons.validate('app.bsky.feed.defs#threadViewPost', v);
}
export function isNotFoundPost(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.defs#notFoundPost');
}
export function validateNotFoundPost(v) {
    return lexicons.validate('app.bsky.feed.defs#notFoundPost', v);
}
export function isBlockedPost(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.defs#blockedPost');
}
export function validateBlockedPost(v) {
    return lexicons.validate('app.bsky.feed.defs#blockedPost', v);
}
export function isBlockedAuthor(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.defs#blockedAuthor');
}
export function validateBlockedAuthor(v) {
    return lexicons.validate('app.bsky.feed.defs#blockedAuthor', v);
}
export function isViewerThreadState(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.defs#viewerThreadState');
}
export function validateViewerThreadState(v) {
    return lexicons.validate('app.bsky.feed.defs#viewerThreadState', v);
}
export function isGeneratorView(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.defs#generatorView');
}
export function validateGeneratorView(v) {
    return lexicons.validate('app.bsky.feed.defs#generatorView', v);
}
export function isGeneratorViewerState(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.defs#generatorViewerState');
}
export function validateGeneratorViewerState(v) {
    return lexicons.validate('app.bsky.feed.defs#generatorViewerState', v);
}
export function isSkeletonFeedPost(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.defs#skeletonFeedPost');
}
export function validateSkeletonFeedPost(v) {
    return lexicons.validate('app.bsky.feed.defs#skeletonFeedPost', v);
}
export function isSkeletonReasonRepost(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.defs#skeletonReasonRepost');
}
export function validateSkeletonReasonRepost(v) {
    return lexicons.validate('app.bsky.feed.defs#skeletonReasonRepost', v);
}
export function isThreadgateView(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.feed.defs#threadgateView');
}
export function validateThreadgateView(v) {
    return lexicons.validate('app.bsky.feed.defs#threadgateView', v);
}
