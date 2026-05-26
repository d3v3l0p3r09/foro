import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { UserRank } from '../../../core/models/user.model';

/** Muestra icono de karma por tramo y badge de rango. Sustituye PNG en assets/img/karma/. */
@Component({
  selector: 'app-karma-widget',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="flex items-center gap-3">
      <img
        [src]="karmaImageSrc"
        [alt]="'Karma ' + karma"
        class="h-14 w-14 object-contain"
        (error)="onImageError($event)"
      />
      <div>
        <p class="text-2xl font-bold text-brand-600 dark:text-brand-400">{{ karma }}</p>
        <span class="inline-block rounded-full px-3 py-0.5 text-xs font-semibold" [ngClass]="badgeClass">
          {{ rankLabel }}
        </span>
      </div>
    </div>
  `,
})
export class KarmaWidgetComponent {
  @Input({ required: true }) karma = 0;
  @Input() rank?: UserRank;

  /** Rutas preparadas para PNG finales; SVG como placeholder. */
  get karmaImageSrc(): string {
    if (this.karma < 100) return 'assets/img/karma/novato.svg';
    if (this.karma <= 500) return 'assets/img/karma/colaborador.svg';
    return 'assets/img/karma/leyenda.svg';
  }

  get rankLabel(): UserRank {
    if (this.rank) return this.rank;
    if (this.karma > 500) return 'Leyenda';
    if (this.karma >= 100) return 'Colaborador';
    return 'Novato';
  }

  get badgeClass(): string {
    const map: Record<UserRank, string> = {
      Novato: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      Colaborador: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      Leyenda: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    };
    return map[this.rankLabel];
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const tier = this.karma < 100 ? 'novato' : this.karma <= 500 ? 'colaborador' : 'leyenda';
    img.src = `assets/img/karma/${tier}.png`;
  }
}
