import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkModeSubject: BehaviorSubject<boolean>;
  public darkMode$: Observable<boolean>;

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
    this.applyDarkModeToBody(isDarkMode);
  }

  /**
   * Get the current dark mode state
   * @returns current dark mode state
   */
  getDarkMode(): boolean {
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
   * @param isDarkMode - true for dark mode, false for light mode
   */
  private applyDarkModeToBody(isDarkMode: boolean): void {
    const body = document.body;
    if (isDarkMode) {
      body.classList.remove('light');
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
      body.classList.add('light');
    }
  }
}
