import { Injectable, inject } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SellerApplication } from './models';

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private firestore = inject(Firestore);

  /** Все заявки; id документа = uid пользователя (одна заявка на человека). */
  readonly applications$: Observable<(SellerApplication & { uid: string })[]> =
    collectionData(collection(this.firestore, 'applications'), {
      idField: 'uid',
    }) as Observable<(SellerApplication & { uid: string })[]>;

  submit(uid: string, email: string): Promise<void> {
    return setDoc(doc(this.firestore, 'applications', uid), {
      email,
      createdAt: serverTimestamp(),
    });
  }

  cancel(uid: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'applications', uid));
  }

  /** Одобрить: выдать роль продавца и убрать заявку. */
  async approve(uid: string): Promise<void> {
    const batch = writeBatch(this.firestore);
    batch.update(doc(this.firestore, 'users', uid), { 'roles.seller': true });
    batch.delete(doc(this.firestore, 'applications', uid));
    await batch.commit();
  }

  reject(uid: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'applications', uid));
  }
}
