import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-book-new',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './book-new.html',
  styleUrl: './book-new.scss',
})
export class BookNew {
  model = {
    title: '',
    author: '',
    publishedDate: '',
    description: '',
  };

  constructor(
    private readonly booksService: BooksService,
    private readonly router: Router
  ) {}

  save() {
    this.booksService.add(this.model);
    this.router.navigateByUrl('/books');
  }
}

