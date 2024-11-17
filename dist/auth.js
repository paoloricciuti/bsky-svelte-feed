import { verifyJwt, AuthRequiredError, parseReqNsid } from '@atproto/xrpc-server';
export const validateAuth = async (req, serviceDid, didResolver) => {
    const { authorization = '' } = req.headers;
    if (!authorization.startsWith('Bearer ')) {
        throw new AuthRequiredError();
    }
    const jwt = authorization.replace('Bearer ', '').trim();
    const nsid = parseReqNsid(req);
    const parsed = await verifyJwt(jwt, serviceDid, nsid, async (did) => {
        return didResolver.resolveAtprotoKey(did);
    });
    return parsed.iss;
};
