import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000'; // Cambia por tu URL del back-end (ej. http://localhost:5000/auth/login)

  constructor(private http: HttpClient) {}

  login(loginData: { email: string; password: string; remember: boolean }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/auth/login`, loginData, { headers });  // Nota: Agregué /auth porque tu namespace es "auth"
  }

  // Método para verificar si es admin
  isAdmin(): boolean {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return false;
    const payload = this.decodeToken(token);
    return payload?.role === 'admin';
  }

  // Método para obtener el token actual
  getToken(): string | null {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  }

  // Método para logout
  logout(): void {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  private decodeToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }
}