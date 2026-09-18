import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../core/products.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
})
export class HomeComponent {
  private productsService = inject(ProductsService);

  readonly products = toSignal(this.productsService.products$, {
    initialValue: [],
  });

  /** Если ссылка на картинку битая — показываем заглушку по категории. */
  onImgError(event: Event, category?: string): void {
    const img = event.target as HTMLImageElement;
    if (img.dataset['fallback']) return;
    img.dataset['fallback'] = '1';
    img.src =
      category === 'laptop'
        ? 'images/placeholder-laptop.svg'
        : 'images/placeholder-phone.svg';
  }
}
