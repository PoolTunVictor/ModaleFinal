import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Address } from '../interface/address';

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
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Address[]>(this.apiUrl, { headers });
  }

  // =========================
  // CREAR DIRECCIÓN
  // =========================
  createAddress(address: Partial<Address>) {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // 👇 AQUÍ ESTÁ LA CLAVE
    return this.http.post<Address>(this.apiUrl, address, { headers });
  }
}
