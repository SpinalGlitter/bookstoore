import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../config/api';

export type Book = {
  id: number;
  title: string;
  author: string;
  publishedDate: string; // "YYYY-MM-DD"
  description: string;
};

export type BookCreateUpdate = Omit<Book, 'id'>;

@Injectable({ providedIn: 'root' })
export class BooksApiService {
  constructor(private readonly http: HttpClient) {}

  getAll() {
    return this.http.get<Book[]>(`${API_BASE}/books`);
  }

  create(dto: BookCreateUpdate) {
    return this.http.post<Book>(`${API_BASE}/books`, dto);
  }

  update(id: number, dto: BookCreateUpdate) {
    return this.http.put<Book>(`${API_BASE}/books/${id}`, dto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${API_BASE}/books/${id}`);
  }
}
