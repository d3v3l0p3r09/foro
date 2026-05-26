import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ThreadService } from '../../core/services/thread.service';
import { ReplyService } from '../../core/services/reply.service';
import { AuthService } from '../../core/services/auth.service';
import { Thread } from '../../core/models/thread.model';
import { Reply } from '../../core/models/reply.model';
import { VoteControlsComponent } from '../../shared/components/vote-controls/vote-controls.component';
import { MarkdownEditorComponent } from '../../shared/components/markdown-editor/markdown-editor.component';
import { MarkdownPipe } from '../../shared/pipes/markdown.pipe';
import { ReplyTreeComponent } from '../../shared/components/reply-tree/reply-tree.component';

@Component({
  selector: 'app-thread-detail',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    VoteControlsComponent,
    MarkdownEditorComponent,
    MarkdownPipe,
    ReplyTreeComponent,
  ],
  templateUrl: './thread-detail.component.html',
})
export class ThreadDetailComponent implements OnInit {
  thread: Thread | null = null;
  replies: Reply[] = [];
  replyBody = '';
  replyParentId: number | null = null;
  loading = true;
  private threadId = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly threadService: ThreadService,
    private readonly replyService: ReplyService,
    public readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.threadId = Number(this.route.snapshot.paramMap.get('id'));
    this.threadService.get(this.threadId).subscribe({
      next: (t) => {
        this.thread = t;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
    this.loadReplies();
  }

  get isThreadAuthor(): boolean {
    return !!this.thread && this.auth.user$.value?.id === this.thread.user_id;
  }

  loadReplies(): void {
    this.replyService.list(this.threadId).subscribe((res) => (this.replies = res));
  }

  score(thread: Thread): number {
    return thread.upvotes - thread.downvotes;
  }

  onThreadVote(value: 1 | -1): void {
    if (!this.thread) return;
    this.threadService.vote(this.thread.id, value).subscribe((res) => {
      this.thread!.upvotes = res.upvotes;
      this.thread!.downvotes = res.downvotes;
      this.thread!.user_vote = res.user_vote ?? undefined;
    });
  }

  onReplyVote(): void {
    this.loadReplies();
  }

  setReplyTo(reply: Reply): void {
    this.replyParentId = reply.id;
    this.replyBody = `@${reply.user?.name} `;
  }

  markBest(reply: Reply): void {
    this.replyService.markBest(reply.id).subscribe(() => {
      this.loadReplies();
      if (this.thread) this.thread.is_resolved = true;
    });
  }

  submitReply(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.replyService
      .create(this.threadId, this.replyBody, this.replyParentId ?? undefined)
      .subscribe(() => {
        this.replyBody = '';
        this.replyParentId = null;
        this.loadReplies();
      });
  }
}
