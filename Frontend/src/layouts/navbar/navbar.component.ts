import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../app/core/service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuOpen: boolean = false;
  searchTerm: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  clearSearch() {
    this.searchTerm = '';
  }

  /** 👇 MÉTODO CLAVE */
  goToAccount() {
    this.menuOpen = false;

    const token = this.authService.getToken();

    // ❌ No logueado
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // ✅ Logueado
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/users']);
    } else {
      this.router.navigate(['/user/resume']);
    }
  }
}
