import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminOrderService {

  private apiUrl = 'https://modalefinal.onrender.com/admin-orders';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`
      })
    };
  }

  getAllOrders() {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

  updateOrderStatus(orderId: number, status: string) {
    return this.http.put(
      `${this.apiUrl}/${orderId}/status`,
      { status },
      this.getHeaders()
    );
  }

  deleteOrder(orderId: number) {
    return this.http.delete(
      `${this.apiUrl}/${orderId}`,
      this.getHeaders()
    );
  }
}
