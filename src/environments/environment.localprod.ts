// Uses the host the page was opened from, so a phone on the network reaches
// this machine (e.g. 192.168.1.152) instead of its own "localhost".
const host = window.location.hostname;

export const environment = {
    production: true,
    landingPageUrl: `http://${host}:4200`
};
