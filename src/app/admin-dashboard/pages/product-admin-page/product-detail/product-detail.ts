import { Component, inject, input, OnInit } from '@angular/core';
import { Product } from '@products/interfaces/product-response.interface';
import { ProductCarousel } from '@products/components/product-carousel/product-carousel';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'product-detail',
  imports: [ProductCarousel, ReactiveFormsModule],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  product = input.required<Product>();

  fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|wome|kid|unisex/)],
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

  onSubmit() {
    console.log(this.productForm.value);
  }
}
