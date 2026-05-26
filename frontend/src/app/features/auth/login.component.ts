import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { GoogleAuthButtonComponent } from '../../shared/components/google-auth-button/google-auth-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, GoogleAuthButtonComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  error = '';
  loading = false;
  googleLoading = false;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('error') === 'google_not_configured') {
      this.error =
        'Google OAuth no está configurado. Añade GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en backend/.env';
    }
  }

  login(): void {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error = err.error?.message || 'Error de autenticación';
        this.loading = false;
      },
    });
  }

  loginWithGoogle(): void {
    this.auth.redirectToGoogle();
  }
}
