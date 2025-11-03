import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCard } from '@products/components/product-card/product-card';
import { PaginationService } from '@shared/pagination/pagination.service';
import { Pagination } from '@shared/pagination/pagination';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, Pagination],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  productsService = inject(ProductsService);
  activatedRoute = inject(ActivatedRoute);
  paginationService = inject(PaginationService);

  gender = toSignal(
    this.activatedRoute.params.pipe(map(({ gender }) => gender))
  );

  productResource = rxResource({
    request: () => ({
      gender: this.gender(),
      page: this.paginationService.currentPage() - 1,
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        gender: request.gender,
        offset: request.page * 9,
      });
    },
  });
}
