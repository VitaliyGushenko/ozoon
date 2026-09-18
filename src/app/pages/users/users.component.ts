import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { UserProfile, UserRoles } from '../../core/models';
import { UiBadge } from '../../ui/badge.component';
import { UiCheckbox } from '../../ui/checkbox.component';
import { UiCard } from '../../ui/card.component';
import { UiEmptyState } from '../../ui/empty-state.component';

type UserRow = UserProfile & { id: string };

@Component({
  selector: 'app-users',
  imports: [UiBadge, UiCheckbox, UiCard, UiEmptyState],
  templateUrl: './users.component.html',
  styleUrl: './users.component.less',
})
export class UsersComponent {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  readonly users = toSignal(
    collectionData(collection(this.firestore, 'users'), {
      idField: 'id',
    }) as Observable<UserRow[]>,
    { initialValue: [] as UserRow[] }
  );

  readonly isAdmin = this.authService.isAdmin;

  /** Учёт легаси-флага для старых профилей. */
  hasRole(profile: UserRow, role: keyof UserRoles): boolean {
    return (
      profile?.roles?.[role] === true ||
      (role === 'seller' && profile?.isSeller === true)
    );
  }

  toggleRole(id: string, role: keyof UserRoles, checked: boolean): void {
    updateDoc(doc(this.firestore, 'users', id), { [`roles.${role}`]: checked })
      .catch(() => alert('Не удалось сохранить роль. Проверьте правила Firestore.'));
  }
}
