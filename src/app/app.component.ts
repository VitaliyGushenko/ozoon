import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { ThemeService } from './core/theme.service';
import { UiButton } from './ui/button.component';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, UiButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  readonly user = this.authService.user;
  readonly isSeller = this.authService.isSeller;
  readonly isAdmin = this.authService.isAdmin;
  readonly theme = this.themeService.theme;

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
