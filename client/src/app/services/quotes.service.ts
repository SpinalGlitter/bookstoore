import { Injectable, signal } from '@angular/core';
import { Quote } from '../models/quote';

@Injectable({ providedIn: 'root' })
export class QuotesService {
  private nextId = 1;

  private readonly _quotes = signal<Quote[]>([
    { id: this.nextId++, 
      text: 'Stay hungry, stay foolish.', 
      author: 'Steve Jobs' },
    {
      id: this.nextId++,
      text: 'Simplicity is the ultimate sophistication.',
      author: 'Leonardo da Vinci',
    },
    { id: this.nextId++, 
      text: 'Talk is cheap. Show me the code.', 
      author: 'Linus Torvalds' },
    {
      id: this.nextId++,
      text: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
    },
    {
      id: this.nextId++,
      text: 'Programs must be written for people to read.',
      author: 'Harold Abelson',
    },
  ]);

  readonly quotes = this._quotes.asReadonly();

  canAddMore(): boolean {
    return this._quotes().length < 5;
  }

  add(quote: Omit<Quote, 'id'>): boolean {
    if (!this.canAddMore()) return false;
    const created: Quote = { id: this.nextId++, ...quote };
    this._quotes.update((list) => [created, ...list]);
    return true;
  }

  update(id: number, changes: Omit<Quote, 'id'>) {
    this._quotes.update((list) => list.map((q) => (q.id === id ? { id, ...changes } : q)));
  }

  remove(id: number) {
    this._quotes.update((list) => list.filter((q) => q.id !== id));
  }

  getById(id: number): Quote | undefined {
    return this._quotes().find((q) => q.id === id);
  }
}
