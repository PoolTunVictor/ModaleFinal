import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://modalefinal.onrender.com'

  constructor(private http: HttpClient) {}

  login(loginData: { email: string; password: string; remember: boolean }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/auth/login`, loginData, { headers });  // Nota: Agregué /auth porque tu namespace es "auth"
  }

  // ===============================
// AUTH STATE
// ===============================
isLoggedIn(): boolean {
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token');

  const user =
    localStorage.getItem('user') ||
    sessionStorage.getItem('user');

  return !!token && !!user;
}

isAdmin(): boolean {
  const user = localStorage.getItem('user');
  if (!user) return false;

  return JSON.parse(user).role === 'admin';
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

  register(registerData: { email: string; password: string; phone?: string }) {
    return this.http.post(
      `${this.apiUrl}/auth/register`,
      registerData
    );
  }
  // ===============================
  // USER (fuente de verdad)
  // ===============================
  getUser(): any | null {
    const user =
      localStorage.getItem('user') ||
      sessionStorage.getItem('user');

    return user ? JSON.parse(user) : null;
  }
}