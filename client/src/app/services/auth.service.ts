import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from './auth-api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'token';
  private readonly _isLoggedIn = signal<boolean>(false);

  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  constructor(private readonly api: AuthApiService) {
    this._isLoggedIn.set(!!this.getToken());
  }

  async register(username: string, password: string): Promise<{ ok: boolean; message?: string }> {
    try {
      await firstValueFrom(this.api.register({ username, password }));
      return { ok: true };
    } catch {
      return { ok: false, message: 'Kunde inte registrera.' };
    }
  }

  async login(username: string, password: string): Promise<{ ok: boolean; message?: string }> {
    try {
      const res = await firstValueFrom(this.api.login({ username, password }));
      localStorage.setItem(this.tokenKey, res.token);
      this._isLoggedIn.set(true);
      return { ok: true };
    } catch {
      return { ok: false, message: 'Fel användarnamn eller lösenord.' };
    }
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this._isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
