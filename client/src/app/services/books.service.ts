import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BooksApiService, Book, BookCreateUpdate } from './books-api.service';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private readonly _books = signal<Book[]>([]);
  readonly books = this._books.asReadonly();

  constructor(private readonly api: BooksApiService) {}

  async load() {
    const list = await firstValueFrom(this.api.getAll());
    this._books.set(list);
  }

  async add(dto: BookCreateUpdate) {
    const created = await firstValueFrom(this.api.create(dto));
    this._books.update(list => [created, ...list]);
  }

  async update(id: number, dto: BookCreateUpdate) {
    const updated = await firstValueFrom(this.api.update(id, dto));
    this._books.update(list => list.map(b => (b.id === id ? updated : b)));
  }

  async remove(id: number) {
    await firstValueFrom(this.api.remove(id));
    this._books.update(list => list.filter(b => b.id !== id));
  }

  getById(id: number) {
    return this._books().find(b => b.id === id);
  }
}
