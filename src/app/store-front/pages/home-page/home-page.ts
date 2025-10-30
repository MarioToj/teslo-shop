import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCard } from '@products/components/product-card/product-card';
import { ProductsService } from '@products/services/products.service';
import { Pagination } from '@shared/pagination/pagination';

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Pagination],
  templateUrl: './home-page.html',
})
export class HomePage {
  productsService = inject(ProductsService);

  productsResource = rxResource({
    request: () => ({}),
    loader: ({ request }) =>
      this.productsService.getProducts({ limit: 5, gender: 'women' }),
  });
}
