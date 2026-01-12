import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../app/core/service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  menuOpen = false;
  searchTerm = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // =========================
  // AUTH HELPERS
  // =========================
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // =========================
  // MENU
  // =========================
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  // =========================
  // SEARCH
  // =========================
  clearSearch() {
    this.searchTerm = '';
  }

  search() {
    if (!this.searchTerm.trim()) return;

    this.router.navigate(['/buscar'], {
      queryParams: { q: this.searchTerm }
    });

    this.menuOpen = false;
  }

  // =========================
  // ACCOUNT ACTION
  // =========================
  goToAccount() {
    this.menuOpen = false;

    if (this.isLoggedIn()) {
      this.router.navigate(['/perfil']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}