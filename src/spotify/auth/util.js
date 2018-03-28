import config from '../../config';

export const generateRandomState = (length) => {
    let state = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        state += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return state;
};

export const getSpotifyAuthUrl = (urlPath) => `${config.spotify.authBaseUri}${urlPath}`;

export const getHostUrl = (urlPath) => {
    if (config.host.production)
        return `${config.host.baseUri}${urlPath}`;
    return `${config.host.baseUri}:${config.host.port}${urlPath}`;
};

export const getClientUrl = (urlPath) => `${config.client.baseUri}${urlPath}`;

const getApplicationToken = () => {
    const tokenToEncrypt = `${config.spotify.clientId}:${config.spotify.clientSecret}`
    return `Basic ${new Buffer(tokenToEncrypt).toString('base64')}`;
}

export const getTokenReqOptions = (form) => ({
    url: getSpotifyAuthUrl('/api/token'),
    headers: {
        'Authorization': getApplicationToken()
    },
    form: form,
    json: true
});