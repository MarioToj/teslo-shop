import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { __param } from 'tslib';

@Component({
  selector: 'app-product-admin-page',
  imports: [],
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage {
  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  router = inject(Router);

  productId = toSignal(
    this.activatedRoute.params.pipe(map((param) => param['id']))
  );

  productResource = rxResource({
    request: () => ({ id: this.productId() }),
    loader: ({ request }) => this.productsService.getProductById(request.id),
  });

  redirectEffet = effect(() => {
    if (this.productResource.error()) {
      this.router.navigateByUrl('/admin/products');
    }
  });
}
