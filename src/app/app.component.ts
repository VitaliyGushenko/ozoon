import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  private authService = inject(AuthService);

  readonly user = this.authService.user;
  readonly isSeller = this.authService.isSeller;
  readonly isAdmin = this.authService.isAdmin;
}
