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
}
