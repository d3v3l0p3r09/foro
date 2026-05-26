import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-vote-controls',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="flex flex-col items-center gap-0.5" (click)="$event.stopPropagation()">
      <button
        type="button"
        (click)="vote.emit(1)"
        [ngClass]="userVote === 1
          ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/30'
          : 'text-slate-400 hover:text-brand-600 dark:hover:text-brand-400'"
        class="rounded-md p-1 transition"
        aria-label="Upvote"
      >
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3l6 6H4l6-6z"/></svg>
      </button>
      <span class="text-sm font-semibold tabular-nums" [ngClass]="score > 0 ? 'text-brand-600' : score < 0 ? 'text-red-500' : 'text-slate-500'">
        {{ score }}
      </span>
      <button
        type="button"
        (click)="vote.emit(-1)"
        [ngClass]="userVote === -1
          ? 'text-red-600 bg-red-50 dark:bg-red-900/30'
          : 'text-slate-400 hover:text-red-500'"
        class="rounded-md p-1 transition"
        aria-label="Downvote"
      >
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 17l-6-6h12l-6 6z"/></svg>
      </button>
    </div>
  `,
})
export class VoteControlsComponent {
  @Input({ required: true }) score = 0;
  @Input() userVote: 1 | -1 | null | undefined = null;
  @Output() vote = new EventEmitter<1 | -1>();
}
