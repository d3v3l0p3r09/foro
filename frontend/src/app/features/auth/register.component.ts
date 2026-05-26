import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterPayload } from '../../core/models/user.model';
import { GoogleAuthButtonComponent } from '../../shared/components/google-auth-button/google-auth-button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, GoogleAuthButtonComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  password_confirmation = '';
  error = '';
  loading = false;
  googleLoading = false;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  register(): void {
    this.loading = true;
    const data: RegisterPayload = {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
    };
    this.auth.register(data).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        const msg = err.error?.message;
        this.error =
          typeof msg === 'string' && msg.includes('SQLSTATE')
            ? 'Error del servidor. Si acabas de actualizar el proyecto, ejecuta: php artisan migrate'
            : msg || 'Error en el registro';
        this.loading = false;
      },
    });
  }

  loginWithGoogle(): void {
    this.auth.redirectToGoogle();
  }
}
