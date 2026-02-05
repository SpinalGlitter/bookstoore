import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './books.html',
  styleUrl: './books.scss',
})
export class Books {
  readonly books = computed(() => this.booksService.books());

  constructor(private readonly booksService: BooksService) {}
}

