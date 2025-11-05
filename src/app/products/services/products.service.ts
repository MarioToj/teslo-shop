import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Gender,
  Product,
  ProductsResponse,
} from '@products/interfaces/product-response.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const newProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as any,
};

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { gender = '', limit = 9, offset = 0 } = options;

    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(tap((resp) => this.productsCache.set(key, resp)));
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    const key = `${idSlug}`;
    if (this.productCache.has(key)) {
      return of(this.productCache.get(key)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
      tap((resp) => console.log(resp)),
      tap((resp) => this.productCache.set(idSlug, resp))
    );
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(newProduct);
    }

    const key = `${id}`;
    if (this.productCache.has(key)) {
      return of(this.productCache.get(key)!);
    }

    return this.http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(tap((resp) => this.productCache.set(id, resp)));
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.http
      .post<Product>(`${baseUrl}/products/`, productLike)
      .pipe(tap((product) => this.updateProductCache(product)));
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>
  ): Observable<Product> {
    return this.http
      .patch<Product>(`${baseUrl}/products/${id}`, productLike)
      .pipe(tap((product) => this.updateProductCache(product)));
  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this.productCache.set(productId, product);

    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currentProduct) => {
          return currentProduct.id === productId ? product : currentProduct;
        }
      );
      console.log('Chache actualizado');
    });
  }
}
