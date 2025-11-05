import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '@products/interfaces/product-response.interface';
import { ProductCarousel } from '@products/components/product-carousel/product-carousel';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from '@shared/form-error-label/form-error-label';
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'product-detail',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  product = input.required<Product>();
  productService = inject(ProductsService);
  router = inject(Router);

  wasSave = signal(false);

  fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(1)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValues(this.product());
  }

  setFormValues(formLike: Partial<Product>) {
    this.productForm.patchValue({ tags: formLike.tags?.join(', ') });
    this.productForm.reset(this.product() as any);
  }

  onSizeClicked(size: string) {
    const curretnSizes = this.productForm.value.sizes ?? [];

    if (curretnSizes.includes(size)) {
      curretnSizes.splice(curretnSizes.indexOf(size), 1);
    } else {
      curretnSizes.push(size);
    }

    this.productForm.patchValue({ sizes: curretnSizes });
  }

  onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();
    if (!isValid) return;

    const formValue = this.productForm.value;

    const rawTags = formValue.tags ?? '';
    const tagString = typeof rawTags === 'string' ? rawTags : String(rawTags);

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: tagString
        .toLowerCase()
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    };

    if (this.product().id === 'new') {
      // crear producto
      this.productService
        .createProduct(productLike)
        .subscribe((createdProduct) => {
          console.log('Producto Creado');
          this.router.navigate(['/admin/products', createdProduct.id]);
        });
    } else {
      this.productService
        .updateProduct(this.product().id, productLike)
        .subscribe((pro) => {
          console.log(pro);
          this.wasSave.set(true);
          setTimeout(() => {
            console.log('timeout eje');
            this.wasSave.set(false);
          }, 2000);
        });
    }
  }
}
