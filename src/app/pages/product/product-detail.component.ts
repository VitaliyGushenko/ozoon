import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  doc,
  docSnapshots,
  Firestore,
} from '@angular/fire/firestore';
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
}
