import { Injectable, signal } from '@angular/core';

type User = { username: string; password: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'token';
  private readonly _isLoggedIn = signal<boolean>(false);

  // simple in-memory "database"
  private users: User[] = [];

  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  constructor() {
    const token = localStorage.getItem(this.tokenKey);
    this._isLoggedIn.set(!!token);
  }

  register(username: string, password: string): { ok: boolean; message?: string } {
    if (!username || !password) return { ok: false, message: 'Användarnamn och lösenord krävs.' };
    if (this.users.some((u) => u.username === username))
      return { ok: false, message: 'Användarnamnet finns redan.' };

    this.users.push({ username, password });
    return { ok: true };
  }

  login(username: string, password: string): { ok: boolean; message?: string } {
    const user = this.users.find((u) => u.username === username && u.password === password);
    if (!user) return { ok: false, message: 'Fel användarnamn eller lösenord.' };


    const token = `mock.${btoa(username)}.${Date.now()}`;
    localStorage.setItem(this.tokenKey, token);
    this._isLoggedIn.set(true);
    return { ok: true };
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this._isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
