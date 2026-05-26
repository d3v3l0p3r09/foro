import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reply } from '../models/reply.model';
import { VoteResult } from '../models/thread.model';

@Injectable({ providedIn: 'root' })
export class ReplyService {
  constructor(private readonly http: HttpClient) {}

  list(threadId: number): Observable<Reply[]> {
    return this.http.get<Reply[]>(`${environment.apiUrl}/threads/${threadId}/replies`);
  }

  create(threadId: number, body: string, parentId?: number): Observable<Reply> {
    return this.http.post<Reply>(`${environment.apiUrl}/threads/${threadId}/replies`, {
      body,
      parent_id: parentId ?? null,
    });
  }

  markBest(replyId: number): Observable<Reply> {
    return this.http.post<Reply>(`${environment.apiUrl}/replies/${replyId}/best`, {});
  }

  vote(replyId: number, value: 1 | -1): Observable<VoteResult> {
    return this.http.post<VoteResult>(`${environment.apiUrl}/replies/${replyId}/vote`, { value });
  }
}
