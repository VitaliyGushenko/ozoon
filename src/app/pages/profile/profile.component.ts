import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { doc, docSnapshots, Firestore } from '@angular/fire/firestore';
import { of, switchMap, map, catchError } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { ApplicationsService } from '../../core/applications.service';
import { SellerApplication } from '../../core/models';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less',
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private applicationsService = inject(ApplicationsService);
  private firestore = inject(Firestore);
  private router = inject(Router);

  readonly user = this.authService.user;
  readonly isSeller = this.authService.isSeller;
  readonly isModerator = this.authService.isModerator;
  readonly isAdmin = this.authService.isAdmin;

  readonly isModeratorOrAdmin = computed(
    () => this.isModerator() || this.isAdmin()
  );

  /** Может ли пользователь подать заявку (покупатель без роли продавца). */
  readonly canApply = computed(
    () => !!this.user() && !this.isSeller() && !this.isAdmin()
  );

  /** Заявка текущего пользователя (id документа = uid). */
  private myApplicationDoc = computed(() => {
    const user = this.user();
    return user ? doc(this.firestore, 'applications', user.uid) : null;
  });

  readonly myApplication = toSignal(
    toObservable(this.myApplicationDoc).pipe(
      switchMap((ref) => (ref ? docSnapshots(ref) : of(null))),
      map((snap) => (snap && snap.exists() ? (snap.data() as SellerApplication) : null)),
      // Ошибка чтения (нет правил для коллекции) = заявки нет
      catchError(() => of(null))
    ),
    { initialValue: undefined }
  );

  /** Все заявки — для модераторов и админа. */
  readonly applications = toSignal(this.applicationsService.applications$, {
    initialValue: [],
  });

  apply(): void {
    const user = this.user();
    if (user?.email) {
      this.applicationsService
        .submit(user.uid, user.email)
        .catch(() => alert('Не удалось отправить заявку. Попробуйте позже.'));
    }
  }

  cancelApplication(): void {
    const user = this.user();
    if (user)
      this.applicationsService
        .cancel(user.uid)
        .catch(() => alert('Не удалось отменить заявку.'));
  }

  approve(uid: string): void {
    this.applicationsService
      .approve(uid)
      .catch(() => alert('Не удалось одобрить заявку.'));
  }

  reject(uid: string): void {
    this.applicationsService
      .reject(uid)
      .catch(() => alert('Не удалось отклонить заявку.'));
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/']);
  }
}
