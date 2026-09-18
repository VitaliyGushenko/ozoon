import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../core/products.service';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.less',
})
export class AddProductComponent {
  private productsService = inject(ProductsService);
  private router = inject(Router);

  title = '';
  description = '';
  imageUrl = '';
  error = '';
  busy = false;

  async submit(): Promise<void> {
    this.error = '';
    this.busy = true;
    try {
      await this.productsService.addProduct({
        title: this.title.trim(),
        description: this.description.trim(),
        imageUrl: this.imageUrl.trim(),
      });
      await this.router.navigate(['/']);
    } catch {
      this.error = 'Не удалось добавить товар. Попробуйте ещё раз.';
    } finally {
      this.busy = false;
    }
  }
}
