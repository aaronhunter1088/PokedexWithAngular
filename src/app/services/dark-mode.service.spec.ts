import {TestBed} from '@angular/core/testing';
import {DarkModeService} from './dark-mode.service';
import {provideRouter} from '@angular/router';

describe('DarkModeService', () => {
    let service: DarkModeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([])]
        });
        service = TestBed.inject(DarkModeService);
    });

    it('should be created', () => {
        expect(service).toBeDefined();
    });

    it('should initialize with light mode (false)', () => {
        expect(service.isDarkMode()).toBe(false);
    });

    it('should set dark mode to true', () => {
        service.setDarkMode(true);
        expect(service.isDarkMode()).toBe(true);
    });

    it('should toggle dark mode', () => {
        service.setDarkMode(false);
        service.toggleDarkMode();
        expect(service.isDarkMode()).toBe(true);
        service.toggleDarkMode();
        expect(service.isDarkMode()).toBe(false);
    });
});