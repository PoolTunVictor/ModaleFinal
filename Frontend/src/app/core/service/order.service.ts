import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'https://modalefinal.onrender.com/orders';

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  createOrder(addressId: number) {

    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const items = this.cartService.getCart().map(item => ({
      product_id: item.product.id,
      quantity: item.quantity
    }));

    return this.http.post(
      this.apiUrl,
      {
        address_id: addressId,
        items
      },
      { headers }
    );
  }
}
