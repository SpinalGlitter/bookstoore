import { Component, signal } from '@angular/core';
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
  error = signal<string>('');

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  async submit() {
    this.error.set('');
    const res = await this.auth.login(this.model.username.trim(), this.model.password);

    if (!res.ok) {
      this.error.set(res.message ?? 'Kunde inte logga in.');
      return;
    }

    await this.router.navigateByUrl('/books');
  }
}
