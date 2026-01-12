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
}
