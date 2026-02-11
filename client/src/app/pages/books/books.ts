import { Component, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './books.html',
  styleUrl: './books.scss',
})
export class Books implements OnInit {
  readonly books = computed(() => this.booksService.books());

  constructor(private readonly booksService: BooksService) {}

  async ngOnInit() {
    await this.booksService.load();
  }

  async remove(id: number) {
    await this.booksService.remove(id);
  }
}
