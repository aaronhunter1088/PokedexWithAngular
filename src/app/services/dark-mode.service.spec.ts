import {TestBed} from '@angular/core/testing';
import {DarkModeService} from './dark-mode.service';

describe('DarkModeService', () => {
    let service: DarkModeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DarkModeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize with light mode (false)', () => {
        expect(service.isDarkMode()).toBeFalse();
    });

    it('should set dark mode to true', () => {
        service.setDarkMode(true);
        expect(service.isDarkMode()).toBeTrue();
    });

    it('should toggle dark mode', () => {
        service.setDarkMode(false);
        service.toggleDarkMode();
        expect(service.isDarkMode()).toBeTrue();
        service.toggleDarkMode();
        expect(service.isDarkMode()).toBeFalse();
    });
});