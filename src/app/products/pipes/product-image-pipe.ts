import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(image: null | string | string[]): string {
    if (image === null) {
      return './assets/images/no-image.jpg';
    }

    if (typeof image === 'string') {
      return `${baseUrl}/files/product/${image}`;
    }

    const img = image.at(0);

    if (!img) {
      return './assets/images/no-image.jpg';
    }

    return `${baseUrl}/files/product/${img}`;
  }
}
