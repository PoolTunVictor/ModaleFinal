import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id?: number;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  stock?: number;
  category_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // 🔓 LISTAR productos
  getProducts(categoryId?: number): Observable<Product[]> {
    const url = categoryId
      ? `${this.apiUrl}?category_id=${categoryId}`
      : this.apiUrl;

    return this.http.get<Product[]>(url);
  }

  // 🔐 CREAR producto (ADMIN)
  createProduct(product: Product, token: string): Observable<Product> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<Product>(this.apiUrl, product, { headers });
  }

  // 🔐 ACTUALIZAR producto
  updateProduct(id: number, product: Product, token: string): Observable<Product> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, { headers });
  }

  // 🔐 ELIMINAR producto
  deleteProduct(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
