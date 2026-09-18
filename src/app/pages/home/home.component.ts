import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../core/products.service';
import { UiBadge } from '../../ui/badge.component';
import { UiCard } from '../../ui/card.component';
import { UiEmptyState } from '../../ui/empty-state.component';

const CATEGORY_LABELS: Record<string, string> = {
  phone: 'Телефон',
  laptop: 'Ноутбук',
};

@Component({
  selector: 'app-home',
  imports: [RouterLink, UiCard, UiBadge, UiEmptyState],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
})
export class HomeComponent {
  private productsService = inject(ProductsService);

  readonly products = toSignal(this.productsService.products$, {
    initialValue: [],
  });

  categoryLabel(category: string): string {
    return CATEGORY_LABELS[category] ?? '';
  }

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
