import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../core/products.service';
import { CATEGORIES, SPEC_TEMPLATES, SpecDef } from '../../core/specs';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.less',
})
export class AddProductComponent {
  private productsService = inject(ProductsService);
  private router = inject(Router);

  readonly categories = CATEGORIES;

  readonly category = signal<string>('');
  readonly specs = signal<Record<string, string>>({});

  title = '';
  description = '';
  imageUrl = '';
  error = '';
  busy = false;

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
    try {
      await this.productsService.addProduct({
        title: this.title.trim(),
        description: this.description.trim(),
        imageUrl: this.imageUrl.trim(),
        category: this.category() as 'phone' | 'laptop',
        specs: { ...this.specs() },
      });
      await this.router.navigate(['/']);
    } catch {
      this.error = 'Не удалось добавить товар. Попробуйте ещё раз.';
    } finally {
      this.busy = false;
    }
  }
}
