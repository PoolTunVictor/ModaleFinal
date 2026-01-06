import { Injectable } from '@angular/core';
import { Product } from '../interface/product';
import { CartItem } from '../interface/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items: CartItem[] = [];

  getCart() {
    return this.items;
  }

  addProduct(product: Product, quantity: number = 1): boolean {
    if (product.stock === undefined) return false;

    const item = this.items.find(i => i.product.id === product.id);

    if (item) {
      if (item.quantity + quantity > product.stock) {
        return false; // 🚫 sin stock
      }
      item.quantity += quantity;
    } else {
      if (quantity > product.stock) {
        return false;
      }
      this.items.push({ product, quantity });
    }

    return true;
  }

  increase(item: CartItem): boolean {
    if (item.product.stock === undefined) return false;
    if (item.quantity + 1 > item.product.stock) return false;

    item.quantity++;
    return true;
  }

  decrease(item: CartItem) {
    if (item.quantity > 1) item.quantity--;
  }

  remove(item: CartItem) {
    this.items = this.items.filter(i => i !== item);
  }

  getTotal() {
    return this.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }
}
