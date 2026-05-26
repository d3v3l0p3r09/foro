import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, ProfileResponse, RegisterPayload, User } from '../models/user.model';

export interface GoogleAuthPayload {
  google_id: string;
  email: string;
  name: string;
  avatar?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'foro_token';
  private readonly userKey = 'foro_user';

  readonly user$ = new BehaviorSubject<User | null>(null);

  constructor(private readonly http: HttpClient) {
    const stored = localStorage.getItem(this.userKey);
    if (stored) {
      try {
        this.user$.next(JSON.parse(stored) as User);
      } catch {
        this.clearSession();
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => this.persistSession(res))
    );
  }

  register(data: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => this.persistSession(res))
    );
  }

  /** Inicia el flujo OAuth redirigiendo al backend (Socialite). */
  redirectToGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/google/redirect`;
  }

  /** Completa sesión tras callback OAuth (?token=...). */
  completeOAuthCallback(token: string): Observable<User> {
    localStorage.setItem(this.tokenKey, token);
    return this.http.get<ProfileResponse>(`${this.apiUrl}/profile`).pipe(
      map((res) => res.user),
      tap((user) => {
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.user$.next(user);
      })
    );
  }

  loginWithGoogle(payload: GoogleAuthPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/google`, payload).pipe(
      tap((res) => this.persistSession(res))
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.clearSession()),
      catchError(() => {
        this.clearSession();
        return of({ message: 'ok' });
      })
    );
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  isAdmin(): boolean {
    return !!this.user$.value?.is_admin;
  }

  private persistSession(res: AuthResponse): void {
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.userKey, JSON.stringify(res.user));
    this.user$.next(res.user);
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.user$.next(null);
  }
}
