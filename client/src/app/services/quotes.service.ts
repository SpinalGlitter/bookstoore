import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { QuotesApiService, Quote, QuoteCreateUpdate } from './quotes-api.service';

@Injectable({ providedIn: 'root' })
export class QuotesService {
  private readonly _quotes = signal<Quote[]>([]);
  readonly quotes = this._quotes.asReadonly();

  constructor(private readonly api: QuotesApiService) {}

  async load() {
    const list = await firstValueFrom(this.api.getAll());
    this._quotes.set(list);
  }

  async add(dto: QuoteCreateUpdate) {
    const created = await firstValueFrom(this.api.create(dto));
    this._quotes.update((list) => [created, ...list]);
  }

  async update(id: number, dto: QuoteCreateUpdate) {
    const updated = await firstValueFrom(this.api.update(id, dto));
    this._quotes.update((list) => list.map((q) => (q.id === id ? updated : q)));
  }

  async remove(id: number) {
    await firstValueFrom(this.api.remove(id));
    this._quotes.update((list) => list.filter((q) => q.id !== id));
  }

  get count() {
    return this._quotes().length;
  }

  canAddMore(): boolean {
    return this._quotes().length < 5;
  }

  getById(id: number) {
    return this._quotes().find((q) => q.id === id);
  }
}
