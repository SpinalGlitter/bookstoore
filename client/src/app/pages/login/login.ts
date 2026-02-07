import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  model = { username: '', password: '' };
  error = '';

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  submit() {
    this.error = '';
    const res = this.auth.login(this.model.username.trim(), this.model.password);
    if (!res.ok) {
      this.error = res.message ?? 'Kunde inte logga in.';
      return;
    }
    this.router.navigateByUrl('/books');
  }
}
