import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../core/interface/product';
import { CartService } from '../../../core/service/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard {

  @Input() product!: Product;

  constructor(private cartService: CartService) {}

  addToCart(event: Event) {
    event.stopPropagation(); // 🚫 no navegar al detalle

    const ok = this.cartService.addProduct(this.product, 1);

    if (!ok) {
      alert('No hay más stock disponible');
    }
  }
}
