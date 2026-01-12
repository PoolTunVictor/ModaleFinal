import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://modalefinal.onrender.com/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // =========================
  // OBTENER USUARIOS (ADMIN)
  // =========================
  getAllUsers(): Observable<any[]> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // =========================
  // CAMBIAR ROL DE USUARIO
  // =========================
  updateUserRole(userId: number, role: string): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(
      `${this.apiUrl}/${userId}/role`,
      { role },
      { headers }
    );
  }
  // =========================
  // ELIMINAR USUARIO
  // =========================
  deleteUser(userId: number) {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(
      `${this.apiUrl}/${userId}`,
      { headers }
    );
  }
}
