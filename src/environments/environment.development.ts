export const environment = {
    production: false,
    get landingPageUrl(): string {
        // Check if running on mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return isMobile ? 'http://192.168.1.152:4200' : 'http://localhost:4200';
    }
};