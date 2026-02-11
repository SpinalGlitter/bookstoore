import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../config/api';

export type Quote = {
  id: number;
  text: string;
  author: string;
};

export type QuoteCreateUpdate = Omit<Quote, 'id'>;

@Injectable({ providedIn: 'root' })
export class QuotesApiService {
  constructor(private readonly http: HttpClient) {}

  getAll() {
    return this.http.get<Quote[]>(`${API_BASE}/quotes`);
  }

  create(dto: QuoteCreateUpdate) {
    return this.http.post<Quote>(`${API_BASE}/quotes`, dto);
  }

  update(id: number, dto: QuoteCreateUpdate) {
    return this.http.put<Quote>(`${API_BASE}/quotes/${id}`, dto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${API_BASE}/quotes/${id}`);
  }
}
