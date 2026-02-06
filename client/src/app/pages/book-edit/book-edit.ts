import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './book-edit.html',
  styleUrl: './book-edit.scss',
})
export class BookEdit {
  private id: number;

  model = {
    title: '',
    author: '',
    publishedDate: '',
    description: '',
  };

  constructor(
    route: ActivatedRoute,
    private readonly booksService: BooksService,
    private readonly router: Router
  ) {
    this.id = Number(route.snapshot.paramMap.get('id'));
    const existing = this.booksService.getById(this.id);

    if (!existing) {
      this.router.navigateByUrl('/books');
      return;
    }

    this.model = {
      title: existing.title,
      author: existing.author,
      publishedDate: existing.publishedDate,
      description: existing.description,
    };
  }

  save() {
    this.booksService.update(this.id, this.model);
    this.router.navigateByUrl('/books');
  }
}

