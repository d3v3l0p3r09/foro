import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { User, ProfileStats } from '../../core/models/user.model';
import { Thread } from '../../core/models/thread.model';
import { Reply } from '../../core/models/reply.model';
import { KarmaWidgetComponent } from '../../shared/components/karma-widget/karma-widget.component';

type ProfileTab = 'threads' | 'replies' | 'settings';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, DatePipe, RouterLink, KarmaWidgetComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  stats: ProfileStats | null = null;
  activeTab: ProfileTab = 'threads';
  myThreads: Thread[] = [];
  myReplies: Reply[] = [];
  editing = false;
  editingImages = false;
  name = '';
  email = '';
  message = '';
  avatarPreview: string | null = null;
  bannerPreview: string | null = null;
  avatarFile?: File;
  bannerFile?: File;
  imageLoading = false;

  constructor(
    private readonly profileService: ProfileService,
    public readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.reloadDashboard();
    this.loadThreads();
  }

  reloadDashboard(): void {
    this.profileService.getDashboard().subscribe({
      next: (res) => {
        this.user = res.user;
        this.stats = res.stats;
        this.name = res.user.name;
        this.email = res.user.email;
        this.auth.user$.next(res.user);
        localStorage.setItem('foro_user', JSON.stringify(res.user));
      },
    });
  }

  setTab(tab: ProfileTab): void {
    this.activeTab = tab;
    if (tab === 'threads') this.loadThreads();
    if (tab === 'replies') this.loadReplies();
  }

  loadThreads(): void {
    this.profileService.myThreads().subscribe((res) => (this.myThreads = res.data));
  }

  loadReplies(): void {
    this.profileService.myReplies().subscribe((res) => (this.myReplies = res.data));
  }

  save(): void {
    this.profileService.update({ name: this.name, email: this.email }).subscribe({
      next: (user) => {
        this.user = user;
        this.auth.user$.next(user);
        localStorage.setItem('foro_user', JSON.stringify(user));
        this.editing = false;
        this.message = 'Perfil actualizado';
      },
      error: () => (this.message = 'Error al actualizar'),
    });
  }

  openImageEditor(): void {
    this.editingImages = true;
    this.avatarPreview = null;
    this.bannerPreview = null;
    this.avatarFile = undefined;
    this.bannerFile = undefined;
  }

  onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.avatarFile = file;
    this.avatarPreview = URL.createObjectURL(file);
  }

  onBannerSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.bannerFile = file;
    this.bannerPreview = URL.createObjectURL(file);
  }

  saveImages(): void {
    if (!this.avatarFile && !this.bannerFile) {
      this.message = 'Selecciona al menos una imagen';
      return;
    }
    this.imageLoading = true;
    this.profileService.updateImages(this.avatarFile, this.bannerFile).subscribe({
      next: (user) => {
        this.user = user;
        this.auth.user$.next(user);
        localStorage.setItem('foro_user', JSON.stringify(user));
        this.editingImages = false;
        this.imageLoading = false;
        this.message = 'Imágenes actualizadas';
      },
      error: () => {
        this.message = 'Error al subir imágenes';
        this.imageLoading = false;
      },
    });
  }

  avatarUrl(): string {
    if (this.avatarPreview) return this.avatarPreview;
    if (this.user?.avatar) return this.user.avatar;
    const name = encodeURIComponent(this.user?.name ?? 'U');
    return `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`;
  }

  bannerUrl(): string {
    if (this.bannerPreview) return this.bannerPreview;
    if (this.user?.banner) return this.user.banner;
    return '';
  }
}
