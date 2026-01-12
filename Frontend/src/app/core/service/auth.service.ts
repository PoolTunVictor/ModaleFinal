import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://modalefinal.onrender.com';

  constructor(private http: HttpClient) {}

  login(loginData: { email: string; password: string; remember: boolean }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, loginData, { headers })
      .pipe(
        tap(res => {
          if (loginData.remember) {
            localStorage.setItem('access_token', res.access_token);
            localStorage.setItem('user', JSON.stringify(res.user));
          } else {
            sessionStorage.setItem('access_token', res.access_token);
            sessionStorage.setItem('user', JSON.stringify(res.user));
          }
        })
      );
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

  getToken(): string | null {
    return (
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token')
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  }

  register(registerData: { email: string; password: string; phone?: string }) {
    return this.http.post(`${this.apiUrl}/auth/register`, registerData);
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
