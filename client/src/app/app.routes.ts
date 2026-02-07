import { Routes } from '@angular/router';
import { BookNew } from './pages/book-new/book-new';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Books } from './pages/books/books';
import { Quotes } from './pages/quotes/quotes';
import { BookEdit } from './pages/book-edit/book-edit';
import { QuoteNew } from './pages/quote-new/quote-new';
import { QuoteEdit } from './pages/quote-edit/quote-edit';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'books' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'books/new', component: BookNew, canActivate: [authGuard] },
  { path: 'books/:id/edit', component: BookEdit, canActivate: [authGuard] },
  { path: 'books', component: Books, canActivate: [authGuard] },
  
  { path: 'quotes/new', component: QuoteNew, canActivate: [authGuard] },
  { path: 'quotes/:id/edit', component: QuoteEdit, canActivate: [authGuard] },
  { path: 'quotes', component: Quotes, canActivate: [authGuard] },
  { path: '**', redirectTo: 'books' },
];

