import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = 'https://modalefinal.onrender.com/addresses';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // =========================
  // LISTAR MIS DIRECCIONES
  // =========================
  getMyAddresses() {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // =========================
  // CREAR DIRECCIÓN
  // =========================
  createAddress(address: any) {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, address, { headers });
  }
}
