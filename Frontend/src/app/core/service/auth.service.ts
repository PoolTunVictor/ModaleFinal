import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  // ===============================
  // LOGIN
  // ===============================
  login(loginData: { email: string; password: string; remember: boolean }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/auth/login`, loginData, { headers });
  }

  // ===============================
  // REGISTER
  // ===============================
  register(registerData: { email: string; password: string; phone?: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/auth/register`, registerData, { headers });
  }

  // ===============================
  // TOKEN
  // ===============================
  getToken(): string | null {
    return (
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token')
    );
  }

  // ===============================
  // USER (FUENTE DE VERDAD)
  // ===============================
  getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ===============================
  // AUTH STATE
  // ===============================
  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  // ===============================
  // LOGOUT (LIMPIEZA TOTAL)
  // ===============================
  logout(): void {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
}
