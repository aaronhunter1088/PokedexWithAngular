import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DarkModeService {
    public darkMode$: Observable<boolean>;
    private darkModeSubject: BehaviorSubject<boolean>;

    constructor() {
        // Initialize with false (light mode) by default
        this.darkModeSubject = new BehaviorSubject<boolean>(false);
        this.darkMode$ = this.darkModeSubject.asObservable();
    }

    /**
     * Set the dark mode state
     * @param isDarkMode - true for dark mode, false for light mode
     */
    setDarkMode(isDarkMode: boolean): void {
        this.darkModeSubject.next(isDarkMode);
        this.applyDarkModeToBody();
    }

    /**
     * Get the current dark mode state
     * @returns current dark mode state
     */
    isDarkMode(): boolean {
        return this.darkModeSubject.value;
    }

    /**
     * Toggle dark mode on/off
     */
    toggleDarkMode(): void {
        const currentMode = this.darkModeSubject.value;
        this.setDarkMode(!currentMode);
    }

    /**
     * Apply dark mode class to body element
     */
    private applyDarkModeToBody(): void {
        const body = document.body;
        if (this.darkModeSubject.value) {
            body.classList.remove('light');
            body.classList.add('dark');
        } else {
            body.classList.remove('dark');
            body.classList.add('light');
        }
    }
}