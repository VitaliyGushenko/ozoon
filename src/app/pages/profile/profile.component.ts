import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less',
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly user = this.authService.user;
  readonly isSeller = this.authService.isSeller;
  readonly isModerator = this.authService.isModerator;
  readonly isAdmin = this.authService.isAdmin;

  /** «Покупатель» — роль по умолчанию; показываем её, если других нет. */
  readonly roleBadges = [
    { label: 'Админ', active: this.isAdmin },
    { label: 'Модератор', active: this.isModerator },
    { label: 'Продавец', active: this.isSeller },
  ];

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/']);
  }
}
