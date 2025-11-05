import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Product } from '@products/interfaces/product-response.interface';
import { ProductCarousel } from '@products/components/product-carousel/product-carousel';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from '@shared/form-error-label/form-error-label';
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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

  tempImages = signal<string[]>([]);

  imageFileList = signal<FileList | undefined>(undefined);

  imagesToCarousel = computed(() => {
    const currentProductImages = [
      ...this.product().images,
      ...this.tempImages(),
    ];
    return currentProductImages;
  });

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

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        typeof formValue.tags === 'string'
          ? formValue.tags
              .toLowerCase()
              .split(',')
              .map((tag) => tag.trim())
          : [],
    };

    if (this.product().id === 'new') {
      // Crear producto
      const product = await firstValueFrom(
        this.productService.createProduct(productLike)
      );

      this.router.navigate(['/admin/products', product.id]);
    } else {
      await firstValueFrom(
        this.productService.updateProduct(this.product().id, productLike)
      );
    }

    this.wasSave.set(true);
    setTimeout(() => {
      this.wasSave.set(false);
    }, 3000);
  }

  onFilesChange(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    this.imageFileList.set(fileList ?? undefined);
    const imageUrls = Array.from(fileList ?? []).map((file) =>
      URL.createObjectURL(file)
    );

    this.tempImages.set(imageUrls);
  }
}
