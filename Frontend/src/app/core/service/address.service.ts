import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = 'http://localhost:5000/addresses/';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  // 📌 GET /addresses
  getAddresses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // 📌 POST /addresses
  createAddress(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      headers: this.getHeaders()
    });
  }

  // 📌 PUT /addresses/:id
  updateAddress(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, {
      headers: this.getHeaders()
    });
  }

  // 📌 DELETE /addresses/:id
  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`, {
      headers: this.getHeaders()
    });
  }
}
