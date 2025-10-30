import { SlicePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product-response.interface';
// import { rxResource } from '@angular/core/rxjs-interop';
// import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  products = input.required<Product>();

  // productsService = inject(ProductsService);

  // filesResource = rxResource({
  //   request: () => ({}),
  //   loader: ({ request }) =>
  //     this.productsService.getProducts({ limit: 5, gender: 'women' }),
  // });
}
