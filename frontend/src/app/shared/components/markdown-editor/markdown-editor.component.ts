import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownPipe } from '../../pipes/markdown.pipe';

@Component({
  selector: 'app-markdown-editor',
  standalone: true,
  imports: [FormsModule, MarkdownPipe],
  template: `
    <div class="space-y-2">
      <div class="flex gap-1 border-b border-slate-200 pb-2 dark:border-slate-700">
        <button type="button" class="btn-ghost text-xs" (click)="wrapBold()">Negrita</button>
        <button type="button" class="btn-ghost text-xs" (click)="wrapItalic()">Cursiva</button>
        <button type="button" class="btn-ghost text-xs" (click)="wrapCode()">Código</button>
        <button type="button" class="btn-ghost text-xs" (click)="preview = !preview">
          {{ preview ? 'Editar' : 'Vista previa' }}
        </button>
      </div>
      @if (!preview) {
        <textarea
          [(ngModel)]="value"
          (ngModelChange)="valueChange.emit(value)"
          [placeholder]="placeholder"
          rows="4"
          class="input-field font-mono text-sm"
        ></textarea>
      } @else {
        <div class="card min-h-[6rem] p-4 text-sm" [innerHTML]="value | markdown"></div>
      }
      <p class="text-xs text-slate-500 dark:text-slate-400">Soporta Markdown básico</p>
    </div>
  `,
})
export class MarkdownEditorComponent {
  @Input() value = '';
  @Input() placeholder = 'Escribe una respuesta...';
  @Output() valueChange = new EventEmitter<string>();
  preview = false;

  wrapBold(): void {
    this.appendWrap('**');
  }

  wrapItalic(): void {
    this.appendWrap('*');
  }

  wrapCode(): void {
    this.appendWrap('`');
  }

  private appendWrap(marker: string): void {
    this.value = this.value + marker + 'texto' + marker;
    this.valueChange.emit(this.value);
  }
}
