import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-description.html',
  styleUrl: './product-description.css'
})
export class ProductDescriptionComponent {

  quantity = 1;
  selectedSize = '50 ml';

  product = {
    name: 'Perfume Miss Dior',
    price: 45,
    description:
      'Fragancia femenina, elegante y atemporal, concebida para expresar sofisticación, feminidad y un espíritu romántico.',
    image: 'assets/product_description/miss-dior.png'
  };

  sizes = ['50 ml', '100 ml'];

  relatedProducts = [
    { name: 'Perfume Giorgio', price: 45, image: 'assets/product_description/gio.png' },
    { name: 'Perfume Miss Dior', price: 45, image: 'assets/product_description/miss-dior.png' },
    { name: 'Shorts', price: 45, image: 'assets/product_description/shorts.png' },
    { name: 'Mascarilla Garnier', price: 45, image: 'assets/product_description/garnier.png' },
    { name: 'Moños', price: 45, image: 'assets/product_description/moños.png' }
  ];

  increase(): void {
    this.quantity++;
  }

  decrease(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  addToCart(): void {
    console.log('Producto agregado', {
      producto: this.product.name,
      tamaño: this.selectedSize,
      cantidad: this.quantity
    });
  }
}
