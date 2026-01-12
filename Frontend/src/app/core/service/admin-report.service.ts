import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminReportService {

  private apiUrl = 'https://modalefinal.onrender.com/admin-reports';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`
      })
    };
  }

  /**
   * Resumen general de reportes
   */
  getSummary(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/summary`,
      this.getHeaders()
    );
  }
}
