const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const environment = {
    production: false,
    get landingPageUrl(): string {
        // Check if running on mobile device
        return isMobile ? `http://${window.location.hostname}:4200` : 'http://localhost:4200';
    }
};