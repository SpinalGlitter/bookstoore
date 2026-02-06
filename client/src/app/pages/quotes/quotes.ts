import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuotesService } from '../../services/quotes.service';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quotes.html',
  styleUrl: './quotes.scss',
})
export class Quotes {
  readonly quotes = computed(() => this.quotesService.quotes());
  readonly canAddMore = computed(() => this.quotesService.canAddMore());

  constructor(private readonly quotesService: QuotesService) {}

  remove(id: number) {
    this.quotesService.remove(id);
  }
}

