import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('client');
  protected readonly theme = signal<'light' | 'dark'>('light');

  constructor(
    private readonly themeService: ThemeService,
    protected readonly auth: AuthService,
  ) {
    this.themeService.init();
    this.theme.set(this.themeService.current);
  }
  toggleTheme() {
    const next = this.themeService.toggle();
    this.theme.set(next);
  }
  logout() {
    this.auth.logout();
  }
}
