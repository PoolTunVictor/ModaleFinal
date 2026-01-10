import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'https://modalefinal.onrender.com/orders/'; // ajusta si es necesario

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) {}

  createOrder(address: any) {
    const items = this.cartService.getCart().map(item => ({
      product_id: item.product.id,
      quantity: item.quantity
    }));

    return this.http.post(this.apiUrl, {
      receiver_name: address.receiver_name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      references: address.references,
      items
    });
  }
}
