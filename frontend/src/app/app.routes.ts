import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/threads/thread-list/thread-list.component').then((m) => m.ThreadListComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./features/auth/google-callback.component').then((m) => m.GoogleCallbackComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/admin-panel.component').then((m) => m.AdminPanelComponent),
  },
  {
    path: 'threads/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/threads/thread-create/thread-create.component').then((m) => m.ThreadCreateComponent),
  },
  {
    path: 'threads/:id',
    loadComponent: () =>
      import('./features/threads/thread-detail.component').then((m) => m.ThreadDetailComponent),
  },
  { path: '**', redirectTo: '' },
];
