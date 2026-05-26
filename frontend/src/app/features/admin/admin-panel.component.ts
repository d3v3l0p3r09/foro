import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface AdminDashboard {
  message: string;
  stats: { users_count: number; threads_count: number };
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-8">
      <a routerLink="/profile" class="text-sm text-brand-600 hover:underline">← Volver al perfil</a>
      <h1 class="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Panel de control</h1>
      <p class="mt-2 text-sm text-slate-500">Área reservada para administradores.</p>

      @if (data) {
        <div class="card mt-6 grid gap-4 p-6 sm:grid-cols-2">
          <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
            <p class="text-2xl font-bold">{{ data.stats.users_count }}</p>
            <p class="text-xs text-slate-500">Usuarios</p>
          </div>
          <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
            <p class="text-2xl font-bold">{{ data.stats.threads_count }}</p>
            <p class="text-xs text-slate-500">Hilos</p>
          </div>
        </div>
        <p class="mt-4 text-sm text-slate-600 dark:text-slate-400">{{ data.message }}</p>
      }
    </div>
  `,
})
export class AdminPanelComponent implements OnInit {
  data: AdminDashboard | null = null;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<AdminDashboard>(`${environment.apiUrl}/admin/dashboard`)
      .subscribe((res) => (this.data = res));
  }
}
