import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCarousel } from '@products/components/product-carousel/product-carousel';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.html',
})
export class ProductPage {
  productsService = inject(ProductsService);
  activatedRoute = inject(ActivatedRoute);
  idSlug = this.activatedRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    request: () => ({
      slug: this.idSlug,
    }),
    loader: ({ request }) => {
      return this.productsService.getProductByIdSlug(request.slug);
    },
  });
}
