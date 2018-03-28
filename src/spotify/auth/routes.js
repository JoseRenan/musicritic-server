import express from 'express';
import querystring from 'querystring';
import request from 'request';

import config from '../../config';
import {
    generateRandomState,
    getSpotifyAuthUrl,
    getHostUrl,
    getClientUrl,
    getTokenReqOptions
} from './util';

const router = express.Router();
const stateKey = 'spotify-auth-state';

router.get('/login', (req, res) => {
    const state = generateRandomState(16);
    res.cookie(stateKey, state);
    res.redirect(getSpotifyAuthUrl('/authorize?')
        + querystring.stringify({
            response_type: 'code',
            client_id: config.spotify.clientId,
            scope: config.spotify.scope,
            redirect_uri: getHostUrl('/auth/callback'),
            state: state
        })
    );
});

router.get('/callback', (req, res) => {
    const state = req.query.state;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
    if (!state || state !== storedState) {
        res.redirect(getClientUrl(config.client.errorPath)
            + querystring.stringify({ error: 'state_mismatch' }));
    } else {
        requestForSpotifyUserToken(req, res);
    }
});

const requestForSpotifyUserToken = (req, res) => {
    res.clearCookie(stateKey);
    const code = req.query.code;
    const tokenRequestOptions = getTokenReqOptions({
        code: code,
        redirect_uri: getHostUrl('/auth/callback'),
        grant_type: 'authorization_code'
    });
    request.post(tokenRequestOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.redirect(getClientUrl(config.client.successPath 
                + `/${body.access_token}/${body.refresh_token}`));
        } else {
            res.redirect(getClientUrl(config.client.errorPath)
                + querystring.stringify({ error: 'invalid_token' }));
        }
    });
}

export default router;
