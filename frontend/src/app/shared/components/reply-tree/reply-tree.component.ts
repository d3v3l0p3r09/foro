import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Reply } from '../../../core/models/reply.model';
import { VoteControlsComponent } from '../vote-controls/vote-controls.component';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reply-tree',
  standalone: true,
  imports: [DatePipe, NgClass, VoteControlsComponent, MarkdownPipe, ReplyTreeComponent],
  template: `
    @for (reply of replies; track reply.id) {
      <article
        class="mb-3 rounded-lg border p-4 transition"
        [ngClass]="reply.is_best
          ? 'border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-500/50 dark:bg-emerald-950/30'
          : 'border-slate-200 dark:border-slate-700'"
        [style.margin-left.rem]="depth * 1.25"
      >
        @if (reply.is_best) {
          <span class="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
            ✓ Mejor respuesta
          </span>
        }
        <div class="flex gap-3">
          @if (auth.isAuthenticated()) {
            <app-vote-controls
              [score]="reply.upvotes - reply.downvotes"
              [userVote]="reply.user_vote ?? null"
              (vote)="voteReply.emit({ reply, value: $event })"
            />
          }
          <div class="min-w-0 flex-1">
            <div class="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span class="font-medium text-slate-700 dark:text-slate-200">{{ reply.user?.name }}</span>
              <time [attr.datetime]="reply.created_at">{{ reply.created_at | date: 'medium' }}</time>
            </div>
            <div class="text-sm" [innerHTML]="reply.body | markdown"></div>
            <div class="mt-3 flex flex-wrap gap-2">
              @if (auth.isAuthenticated()) {
                <button type="button" class="btn-ghost text-xs" (click)="replyTo.emit(reply)">Responder</button>
              }
              @if (isThreadAuthor && !reply.is_best) {
                <button type="button" class="text-xs font-medium text-emerald-600 hover:underline" (click)="markBest.emit(reply)">
                  Marcar como mejor respuesta
                </button>
              }
            </div>
          </div>
        </div>
        @if (reply.children?.length) {
          <div class="mt-3 border-l-2 border-slate-200 pl-3 dark:border-slate-700">
            <app-reply-tree
              [replies]="reply.children!"
              [depth]="depth + 1"
              [isThreadAuthor]="isThreadAuthor"
              (voteReply)="voteReply.emit($event)"
              (replyTo)="replyTo.emit($event)"
              (markBest)="markBest.emit($event)"
            />
          </div>
        }
      </article>
    }
  `,
})
export class ReplyTreeComponent {
  @Input({ required: true }) replies: Reply[] = [];
  @Input() depth = 0;
  @Input() isThreadAuthor = false;
  @Output() voteReply = new EventEmitter<{ reply: Reply; value: 1 | -1 }>();
  @Output() replyTo = new EventEmitter<Reply>();
  @Output() markBest = new EventEmitter<Reply>();

  constructor(public readonly auth: AuthService) {}
}
