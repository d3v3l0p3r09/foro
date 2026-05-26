import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, ThemeToggleComponent],
  template: `
    <header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <a routerLink="/" class="flex items-center gap-2 font-bold tracking-tight text-slate-900 dark:text-white">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">FC</span>
          Foro Comunidad
        </a>
        <nav class="flex items-center gap-2 sm:gap-4">
          <app-theme-toggle />
          @if (auth.isAuthenticated()) {
            <a routerLink="/threads/new" class="btn-primary text-sm">+ Nuevo hilo</a>
            <a routerLink="/profile" routerLinkActive="text-brand-600" class="btn-ghost hidden sm:inline-flex">Perfil</a>
            <button type="button" (click)="logout()" class="text-sm font-medium text-red-600 hover:underline dark:text-red-400">Salir</button>
          } @else {
            <a routerLink="/login" class="btn-ghost">Entrar</a>
            <a routerLink="/register" class="btn-primary hidden sm:inline-flex">Registro</a>
          }
        </nav>
      </div>
    </header>
  `,
})
export class AppNavigationComponent {
  constructor(
    public readonly auth: AuthService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
