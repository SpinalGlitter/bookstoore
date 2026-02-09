import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../config/api';

type RegisterRequest = { username: string; password: string };
type LoginRequest = { username: string; password: string };

type LoginResponse = { token: string };

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly http: HttpClient) {}

  register(body: RegisterRequest) {
    return this.http.post<void>(`${API_BASE}/auth/register`, body);
  }

  login(body: LoginRequest) {
    return this.http.post<LoginResponse>(`${API_BASE}/auth/login`, body);
  }
}
