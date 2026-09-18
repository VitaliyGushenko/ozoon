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
  /** Характеристики, выбираемые покупателем: ключ -> доступные значения. */
  readonly variants = signal<Record<string, string[]>>({});
  readonly images = signal<string[]>([]);
  readonly editMode = signal(false);

  newImageUrl = '';
  title = '';
  description = '';
  error = '';
  busy = false;

  private editingId: string | null = null;

  readonly currentSpecs = computed<SpecDef[]>(() => {
    const category = this.category();
    return category ? SPEC_TEMPLATES[category as 'phone' | 'laptop'] : [];
  });

  /** Все обязательные поля заполнены: фиксированные характеристики + варианты. */
  readonly specsComplete = computed(() => {
    const specs = this.currentSpecs();
    const values = this.specs();
    const variants = this.variants();
    const fixed = specs.filter((s) => !variants[s.key]);
    return (
      fixed.length > 0 &&
      fixed.every((s) => String(values[s.key] ?? '').trim().length > 0) &&
      Object.values(variants).every((vals) => vals.length > 0)
    );
  });

  readonly imagesComplete = computed(() => this.images().length > 0);

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
    this.images.set(product.images?.length ? product.images : [product.imageUrl].filter(Boolean));
    this.specs.set(product.specs ?? {});
    this.variants.set(product.variants ?? {});
  }

  onCategoryChange(value: string): void {
    this.specs.set({});
    this.variants.set({});
    this.category.set(value);
  }

  onSpecChange(key: string, value: string | number): void {
    this.specs.update((specs) => ({ ...specs, [key]: String(value) }));
  }

  // --- Варианты, выбираемые покупателем ---

  isVariant(key: string): boolean {
    return !!this.variants()[key];
  }

  toggleVariant(key: string, enabled: boolean): void {
    this.variants.update((variants) => {
      const next = { ...variants };
      if (enabled) {
        next[key] = [];
      } else {
        delete next[key];
      }
      return next;
    });
  }

  hasVariantValue(key: string, value: string): boolean {
    return this.variants()[key]?.includes(value) ?? false;
  }

  toggleVariantValue(key: string, value: string, checked: boolean): void {
    this.variants.update((variants) => {
      const current = variants[key] ?? [];
      const next = checked
        ? [...current, value]
        : current.filter((v) => v !== value);
      return { ...variants, [key]: next };
    });
  }

  // --- Изображения ---

  addImage(): void {
    const url = this.newImageUrl.trim();
    if (!url || this.images().includes(url)) return;
    this.images.update((images) => [...images, url]);
    this.newImageUrl = '';
  }

  removeImage(index: number): void {
    this.images.update((images) => images.filter((_, i) => i !== index));
  }

  async submit(): Promise<void> {
    this.error = '';
    this.busy = true;
    const images = this.images();
    const data = {
      title: this.title.trim(),
      description: this.description.trim(),
      category: this.category() as 'phone' | 'laptop',
      specs: { ...this.specs() },
      images,
      variants: this.variants(),
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
