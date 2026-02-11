import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { QuotesService } from '../../services/quotes.service';

@Component({
  selector: 'app-quote-new',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './quote-new.html',
  styleUrl: './quote-new.scss',
})
export class QuoteNew {
  model = { text: '', author: '' };

  readonly canAddMore = computed(() => this.quotesService.canAddMore());

  constructor(
    private readonly quotesService: QuotesService,
    private readonly router: Router,
  ) {}

  async save() {
    if (!this.quotesService.canAddMore()) return;

    await this.quotesService.add(this.model);
    await this.router.navigateByUrl('/quotes');
  }
}
