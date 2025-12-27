import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductImageService {

  private apiUrl = `${environment.apiUrl}/product-images`;

  constructor(private http: HttpClient) {}

  // 📷 Subir imagen
  uploadImage(
    productId: number,
    file: File,
    isMain: boolean,
    token: string
  ): Observable<any> {

    const formData = new FormData();
    formData.append('product_id', productId.toString());
    formData.append('is_main', String(isMain));
    formData.append('file', file);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, formData, { headers });
  }

  // 📷 Obtener imágenes por producto
  getImages(productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?product_id=${productId}`);
  }

  // 🗑️ Eliminar imagen
  deleteImage(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
