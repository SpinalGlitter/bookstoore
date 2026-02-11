import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuotesService } from '../../services/quotes.service';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quotes.html',
  styleUrl: './quotes.scss',
})
export class Quotes implements OnInit {
  readonly quotes = computed(() => this.quotesService.quotes());
  readonly canAddMore = computed(() => this.quotesService.count < 5);

  model = signal({ text: '', author: '' });

  constructor(private readonly quotesService: QuotesService) {}

  async ngOnInit() {
    await this.quotesService.load();
  }

  async add() {
    if (!this.canAddMore()) return;
    const m = this.model();
    await this.quotesService.add({ text: m.text, author: m.author });
    this.model.set({ text: '', author: '' });
  }

  async remove(id: number) {
    await this.quotesService.remove(id);
  }
}
