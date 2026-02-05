import { Routes } from '@angular/router';
import { BookNew } from './pages/book-new/book-new';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Books } from './pages/books/books';
import { Quotes } from './pages/quotes/quotes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'books' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'books/new', component: BookNew },
  { path: 'books', component: Books },
  { path: 'quotes', component: Quotes },
  { path: '**', redirectTo: 'books' },
];

