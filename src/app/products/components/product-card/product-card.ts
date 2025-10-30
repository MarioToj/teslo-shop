import { SlicePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product-response.interface';
import { ProductImagePipe } from '@products/pipes/product-image-pipe';
// import { rxResource } from '@angular/core/rxjs-interop';
// import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<Product>();

  // imagesUrls = computed(() => {
  //   return `http://localhost:3000/api/files/product/${
  //     this.product().images[0]
  //   }`;
  // });

  // productsService = inject(ProductsService);

  // filesResource = rxResource({
  //   request: () => ({}),
  //   loader: ({ request }) =>
  //     this.productsService.getProducts({ limit: 5, gender: 'women' }),
  // });
}
