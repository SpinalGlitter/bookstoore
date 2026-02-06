import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuotesService } from '../../services/quotes.service';

@Component({
  selector: 'app-quote-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './quote-edit.html',
  styleUrl: './quote-edit.scss',
})
export class QuoteEdit {
  private id: number;

  model = { text: '', author: '' };

  constructor(
    route: ActivatedRoute,
    private readonly quotesService: QuotesService,
    private readonly router: Router,
  ) {
    this.id = Number(route.snapshot.paramMap.get('id'));
    const existing = this.quotesService.getById(this.id);

    if (!existing) {
      this.router.navigateByUrl('/quotes');
      return;
    }

    this.model = { text: existing.text, author: existing.author };
  }

  save() {
    this.quotesService.update(this.id, this.model);
    this.router.navigateByUrl('/quotes');
  }
}
