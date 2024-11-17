import { lexicons } from '../../../../lexicons.js';
import { isObj, hasProp } from '../../../../util.js';
export function isNotification(v) {
    return (isObj(v) &&
        hasProp(v, '$type') &&
        v.$type === 'app.bsky.notification.listNotifications#notification');
}
export function validateNotification(v) {
    return lexicons.validate('app.bsky.notification.listNotifications#notification', v);
}
