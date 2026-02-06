import { Injectable } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly key = 'theme';

  init() {
    const saved = (localStorage.getItem(this.key) as Theme | null) ?? 'light';
    this.apply(saved);
  }

  get current(): Theme {
    return (document.documentElement.getAttribute('data-bs-theme') as Theme) ?? 'light';
  }

  toggle(): Theme {
    const next: Theme = this.current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    return next;
  }

  private apply(theme: Theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(this.key, theme);
  }
}
