import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuOpen: boolean = false; // estado del menú
  searchTerm: string = '';

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  clearSearch() {
    this.searchTerm = '';
  }
}
