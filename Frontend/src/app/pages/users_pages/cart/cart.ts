import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {

  cartItems = [
    {
      name: 'Mascarilla Hidratante',
      size: '50 ml',
      price: 45,
      quantity: 1,
      image: 'assets/product_description/garnier.png'
    },
    {
      name: 'Moño para el Cabello',
      size: 'Rojo Rubí',
      price: 22,
      quantity: 2,
      image: 'assets/product_description/moños.png'
    },
    {
      name: 'Perfume Miss Dior',
      size: '100 ml',
      price: 65,
      quantity: 1,
      image: 'assets/product_description/miss-dior.png'
    }
  ];

  increase(item: any) {
    item.quantity++;
  }

  decrease(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  remove(item: any) {
    this.cartItems = this.cartItems.filter(i => i !== item);
  }

  getTotal() {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );
  }
}
