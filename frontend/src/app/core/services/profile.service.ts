import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProfileResponse, User } from '../models/user.model';
import { PaginatedThreads } from '../models/thread.model';
import { Reply } from '../models/reply.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly base = `${environment.apiUrl}/profile`;

  constructor(private readonly http: HttpClient) {}

  getDashboard(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.base);
  }

  update(data: Partial<Pick<User, 'name' | 'email' | 'avatar'>>): Observable<User> {
    return this.http.put<User>(this.base, data);
  }

  updateImages(avatar?: File, banner?: File): Observable<User> {
    const form = new FormData();
    if (avatar) form.append('avatar', avatar);
    if (banner) form.append('banner', banner);
    return this.http.post<User>(`${this.base}/update-images`, form);
  }

  myThreads(page = 1): Observable<PaginatedThreads> {
    return this.http.get<PaginatedThreads>(`${this.base}/threads`, { params: { page } });
  }

  myReplies(page = 1): Observable<{ data: Reply[] }> {
    return this.http.get<{ data: Reply[] }>(`${this.base}/replies`, { params: { page } });
  }
}
