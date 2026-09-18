import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { doc, docSnapshots, Firestore } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { ProductsService } from '../../core/products.service';
import { Product } from '../../core/models';
import { CATEGORIES, SPEC_TEMPLATES, SpecDef } from '../../core/specs';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.less',
})
export class AddProductComponent {
  private productsService = inject(ProductsService);
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly categories = CATEGORIES;

  readonly category = signal<string>('');
  readonly specs = signal<Record<string, string>>({});
  readonly editMode = signal(false);

  title = '';
  description = '';
  imageUrl = '';
  error = '';
  busy = false;

  private editingId: string | null = null;

  readonly currentSpecs = computed<SpecDef[]>(() => {
    const category = this.category();
    return category ? SPEC_TEMPLATES[category as 'phone' | 'laptop'] : [];
  });

  readonly specsComplete = computed(() => {
    const specs = this.currentSpecs();
    const values = this.specs();
    return (
      specs.length > 0 &&
      specs.every((s) => String(values[s.key] ?? '').trim().length > 0)
    );
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode.set(true);
      this.editingId = id;
      this.load(id);
    }
  }

  /** Загружает товар для редактирования; чужие товары открывать нельзя. */
  private async load(id: string): Promise<void> {
    const snap = await firstValueFrom(
      docSnapshots(doc(this.firestore, 'products', id))
    );
    if (!snap || !snap.exists()) {
      await this.router.navigate(['/']);
      return;
    }
    const product = { id: snap.id, ...(snap.data() as Omit<Product, 'id'>) };
    const user = this.authService.user();
    if (!user || product.sellerUid !== user.uid) {
      await this.router.navigate(['/product', id]);
      return;
    }
    this.category.set(product.category);
    this.title = product.title;
    this.description = product.description;
    this.imageUrl = product.imageUrl;
    this.specs.set(product.specs ?? {});
  }

  onCategoryChange(value: string): void {
    this.specs.set({});
    this.category.set(value);
  }

  onSpecChange(key: string, value: string | number): void {
    this.specs.update((specs) => ({ ...specs, [key]: String(value) }));
  }

  async submit(): Promise<void> {
    this.error = '';
    this.busy = true;
    const data = {
      title: this.title.trim(),
      description: this.description.trim(),
      imageUrl: this.imageUrl.trim(),
      category: this.category() as 'phone' | 'laptop',
      specs: { ...this.specs() },
    };
    try {
      if (this.editMode() && this.editingId) {
        await this.productsService.updateProduct(this.editingId, data);
        await this.router.navigate(['/product', this.editingId]);
      } else {
        await this.productsService.addProduct(data);
        await this.router.navigate(['/']);
      }
    } catch {
      this.error = 'Не удалось сохранить товар. Попробуйте ещё раз.';
    } finally {
      this.busy = false;
    }
  }
}
