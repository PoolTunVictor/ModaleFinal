import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // ✅ Usuario logueado (token + user)
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // ❌ No logueado → login
    this.router.navigate(['/login']);
    return false;
  }
}