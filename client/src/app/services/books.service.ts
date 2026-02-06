import { Injectable, signal } from '@angular/core';
import { Book } from '../models/book';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private nextId = 1;

  private readonly _books = signal<Book[]>([]);
  readonly books = this._books.asReadonly();

  add(book: Omit<Book, 'id'>) {
    const created: Book = { id: this.nextId++, ...book };
    this._books.update((list) => [created, ...list]);
  }

  getById(id: number): Book | undefined {
    return this._books().find((b) => b.id === id);
  }
  update(id: number, changes: Omit<Book, 'id'>) {
    this._books.update((list) => list.map((b) => (b.id === id ? { id, ...changes } : b)));
  }

  remove(id: number) {
    this._books.update((list) => list.filter((b) => b.id !== id));
  }
}
