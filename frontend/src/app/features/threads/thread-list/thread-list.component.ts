import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { ThreadService } from '../../../core/services/thread.service';
import { Thread, ThreadSort } from '../../../core/models/thread.model';
import { AuthService } from '../../../core/services/auth.service';
import { VoteControlsComponent } from '../../../shared/components/vote-controls/vote-controls.component';

@Component({
  selector: 'app-thread-list',
  standalone: true,
  imports: [DatePipe, NgClass, RouterLink, VoteControlsComponent],
  templateUrl: './thread-list.component.html',
})
export class ThreadListComponent implements OnInit {
  threads: Thread[] = [];
  loading = true;
  error = '';
  currentPage = 1;
  lastPage = 1;
  total = 0;
  activeSort: ThreadSort = 'recent';

  readonly sortOptions: { key: ThreadSort; label: string }[] = [
    { key: 'recent', label: 'Más recientes' },
    { key: 'top', label: 'Más votados' },
    { key: 'unresolved', label: 'Sin resolver' },
  ];

  constructor(
    private readonly threadService: ThreadService,
    private readonly router: Router,
    public readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadThreads();
  }

  setSort(sort: ThreadSort): void {
    this.activeSort = sort;
    this.loadThreads(1);
  }

  loadThreads(page = 1): void {
    this.loading = true;
    this.threadService.list(page, this.activeSort).subscribe({
      next: (res) => {
        this.threads = res.data;
        this.currentPage = res.current_page;
        this.lastPage = res.last_page;
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los hilos.';
        this.loading = false;
      },
    });
  }

  goToThread(thread: Thread): void {
    this.router.navigate(['/threads', thread.id]);
  }

  score(thread: Thread): number {
    return thread.upvotes - thread.downvotes;
  }

  onVote(thread: Thread, value: 1 | -1): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.threadService.vote(thread.id, value).subscribe((res) => {
      thread.upvotes = res.upvotes;
      thread.downvotes = res.downvotes;
      thread.user_vote = res.user_vote ?? undefined;
    });
  }

  toggleBookmark(thread: Thread, event: Event): void {
    event.stopPropagation();
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    const req = thread.is_bookmarked
      ? this.threadService.unbookmark(thread.id)
      : this.threadService.bookmark(thread.id);
    req.subscribe((res) => (thread.is_bookmarked = res.is_bookmarked));
  }
}
