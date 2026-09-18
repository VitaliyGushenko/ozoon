import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less',
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly user = this.authService.user;
  readonly profile = this.authService.profile;
  readonly isSeller = this.authService.isSeller;

  async toggleSeller(enabled: boolean): Promise<void> {
    await this.authService.setSeller(enabled);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/']);
  }
}
