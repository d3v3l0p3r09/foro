import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedThreads, Thread, ThreadSort, VoteResult } from '../models/thread.model';

export interface CreateThreadPayload {
  title: string;
  body: string;
  category_id: number;
}

@Injectable({ providedIn: 'root' })
export class ThreadService {
  private readonly base = `${environment.apiUrl}/threads`;

  constructor(private readonly http: HttpClient) {}

  list(page = 1, sort: ThreadSort = 'recent'): Observable<PaginatedThreads> {
    const params = new HttpParams().set('page', page).set('sort', sort);
    return this.http.get<PaginatedThreads>(this.base, { params });
  }

  get(id: number): Observable<Thread> {
    return this.http.get<Thread>(`${this.base}/${id}`);
  }

  create(payload: CreateThreadPayload): Observable<Thread> {
    return this.http.post<Thread>(this.base, payload);
  }

  vote(threadId: number, value: 1 | -1): Observable<VoteResult> {
    return this.http.post<VoteResult>(`${this.base}/${threadId}/vote`, { value });
  }

  bookmark(threadId: number): Observable<{ is_bookmarked: boolean }> {
    return this.http.post<{ is_bookmarked: boolean }>(`${this.base}/${threadId}/bookmark`, {});
  }

  unbookmark(threadId: number): Observable<{ is_bookmarked: boolean }> {
    return this.http.delete<{ is_bookmarked: boolean }>(`${this.base}/${threadId}/bookmark`);
  }
}
