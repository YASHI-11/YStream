const spotifyConfig = {
    clientId: '6b73b05d08d24e5c935cc49ae413e6fd',
    redirectUri: 'https://localhost:5500/callback.html',
    scopes: [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-modify-playback-state',
        'user-read-playback-state'
    ].join(' ')
};
