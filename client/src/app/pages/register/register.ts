import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  model = { username: '', password: '' };
  error = '';

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  async submit() {
  this.error = '';
  const res = await this.auth.register(this.model.username.trim(), this.model.password);
  if (!res.ok) {
    this.error = res.message ?? 'Kunde inte registrera.';
    return;
  }
  this.router.navigateByUrl('/login');
}

}
