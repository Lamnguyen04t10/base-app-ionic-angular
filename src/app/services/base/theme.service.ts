import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  darkMode = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Check local storage or system preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        this.darkMode.set(true);
      }
    }

    effect(() => {
      const isDark = this.darkMode();
      if (isPlatformBrowser(this.platformId)) {
        if (isDark) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      }
    });
  }

  toggleDarkMode() {
    this.darkMode.update(v => !v);
  }
}
