import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/service/cart.service';
import { BannerComponent } from '../../../../shared/banner/banner';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, BannerComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {

  constructor(public cartService: CartService) {}

  get cartItems() {
    return this.cartService.getCart();
  }

  increase(item: any) {
    const ok = this.cartService.increase(item);
    if (!ok) {
      alert('No hay más stock');
    }
  }

  decrease(item: any) {
    this.cartService.decrease(item);
  }

  remove(item: any) {
    this.cartService.remove(item);
  }

  getTotal() {
    return this.cartService.getTotal();
  }
}
