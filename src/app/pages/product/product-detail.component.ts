import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  doc,
  docSnapshots,
  Firestore,
} from '@angular/fire/firestore';
import { AuthService } from '../../core/auth.service';
import { ProductsService } from '../../core/products.service';
import { Product } from '../../core/models';
import { CATEGORIES, SPEC_TEMPLATES, SpecDef } from '../../core/specs';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.less',
})
export class ProductDetailComponent {
  private firestore = inject(Firestore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private productsService = inject(ProductsService);

  private productId = signal<string>(this.route.snapshot.paramMap.get('id') ?? '');

  private snapshot = toSignal(
    docSnapshots(doc(this.firestore, 'products', this.productId()))
  );

  readonly loaded = computed(() => this.snapshot() !== undefined);
  readonly product = computed<Product | null>(() => {
    const snap = this.snapshot();
    if (!snap || !snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Product, 'id'>) };
  });

  /** Кнопки редактирования и удаления видит только владелец товара. */
  readonly isOwner = computed(() => {
    const product = this.product();
    const user = this.authService.user();
    return !!product && !!user && product.sellerUid === user.uid;
  });

  readonly categoryLabel = computed(() => {
    const product = this.product();
    if (!product) return '';
    return CATEGORIES.find((c) => c.value === product.category)?.label ?? '';
  });

  readonly specRows = computed<{ def: SpecDef; value: string }[]>(() => {
    const product = this.product();
    if (!product || !product.category || !product.specs) return [];
    return SPEC_TEMPLATES[product.category].map((def) => ({
      def,
      value: product.specs[def.key] ?? '—',
    }));
  });

  async delete(): Promise<void> {
    const product = this.product();
    if (!product?.id) return;
    if (!confirm('Удалить товар «' + product.title + '»?')) return;
    await this.productsService.deleteProduct(product.id);
    await this.router.navigate(['/']);
  }
}
