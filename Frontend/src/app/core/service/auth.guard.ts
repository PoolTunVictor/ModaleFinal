import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    if (token) {
      return true;  // Usuario logueado, permite acceso
    } else {
      this.router.navigate(['/login']);  // No logueado, redirige a login
      return false;
    }
  }
}