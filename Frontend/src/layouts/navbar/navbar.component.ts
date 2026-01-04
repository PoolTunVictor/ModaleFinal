import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

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
}
