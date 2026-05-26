import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ThreadService } from '../../../core/services/thread.service';
import { Category } from '../../../core/models/thread.model';
import { MarkdownEditorComponent } from '../../../shared/components/markdown-editor/markdown-editor.component';

@Component({
  selector: 'app-thread-create',
  standalone: true,
  imports: [FormsModule, RouterLink, MarkdownEditorComponent],
  templateUrl: './thread-create.component.html',
})
export class ThreadCreateComponent implements OnInit {
  categories: Category[] = [];
  title = '';
  body = '';
  categoryId: number | null = null;
  error = '';
  loading = false;

  constructor(
    private readonly categoryService: CategoryService,
    private readonly threadService: ThreadService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.list().subscribe({
      next: (cats) => {
        this.categories = cats;
        if (cats.length) this.categoryId = cats[0].id;
      },
    });
  }

  submit(): void {
    if (!this.categoryId) {
      this.error = 'Selecciona una categoría';
      return;
    }
    this.loading = true;
    this.error = '';
    this.threadService
      .create({ title: this.title, body: this.body, category_id: this.categoryId })
      .subscribe({
        next: (thread) => this.router.navigate(['/threads', thread.id]),
        error: (err) => {
          this.error = err.error?.message || 'No se pudo publicar el hilo';
          this.loading = false;
        },
      });
  }
}
