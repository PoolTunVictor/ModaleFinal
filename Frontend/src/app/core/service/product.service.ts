import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../interface/product'; // ✅ solo se importa

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

  // 🔐 CREAR producto
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // 🔐 ACTUALIZAR producto
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // 🔐 ELIMINAR producto
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
