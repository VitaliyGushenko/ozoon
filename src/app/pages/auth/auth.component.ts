import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { UiButton } from '../../ui/button.component';
import { UiCard } from '../../ui/card.component';
import { UiInput } from '../../ui/input.component';

const ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Некорректный email.',
  'auth/missing-password': 'Введите пароль.',
  'auth/weak-password': 'Пароль должен содержать минимум 6 символов.',
  'auth/email-already-in-use': 'Пользователь с таким email уже зарегистрирован.',
  'auth/invalid-credential': 'Неверный email или пароль.',
  'auth/user-not-found': 'Пользователь не найден.',
  'auth/wrong-password': 'Неверный email или пароль.',
  'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже.',
};

@Component({
  selector: 'app-auth',
  imports: [FormsModule, UiButton, UiCard, UiInput],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.less',
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly mode = signal<'login' | 'register'>('login');

  email = '';
  password = '';
  error = '';
  busy = false;

  switchMode(mode: 'login' | 'register'): void {
    this.mode.set(mode);
    this.error = '';
  }

  async submit(): Promise<void> {
    this.error = '';
    this.busy = true;
    try {
      if (this.mode() === 'register') {
        await this.authService.register(this.email, this.password);
      } else {
        await this.authService.login(this.email, this.password);
      }
      await this.router.navigate(['/']);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      this.error = code
        ? (ERROR_MESSAGES[code] ?? `Ошибка: ${code}`)
        : 'Что-то пошло не так. Попробуйте ещё раз.';
    } finally {
      this.busy = false;
    }
  }
}
