import { Injectable, inject } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Product } from './models';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  readonly products$: Observable<Product[]> = collectionData(
    query(
      collection(this.firestore, 'products'),
      orderBy('createdAt', 'desc')
    ),
    { idField: 'id' }
  ) as Observable<Product[]>;

  addProduct(
    product: Pick<Product, 'title' | 'description' | 'imageUrl' | 'category' | 'specs'>
  ) {
    const user = this.authService.user();
    if (!user) throw new Error('Только авторизованный продавец может добавить товар');
    const col = collection(this.firestore, 'products');
    return addDoc(col, {
      ...product,
      sellerUid: user.uid,
      createdAt: serverTimestamp(),
    });
  }

  updateProduct(
    id: string,
    changes: Pick<Product, 'title' | 'description' | 'imageUrl' | 'category' | 'specs'>
  ) {
    return updateDoc(doc(this.firestore, 'products', id), changes);
  }

  deleteProduct(id: string) {
    return deleteDoc(doc(this.firestore, 'products', id));
  }
}
