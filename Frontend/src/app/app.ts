import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../layouts/navbar/navbar.component';
import { Footer } from './layouts/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    Footer,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  protected readonly title = signal('ModAle');

  // Estados de layout
  showLayout = true;        // navbar
  showFooter = true; 
  showUser = true;      // footer

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;

      // ❌ Login: nada de layout
      this.showLayout = !url.includes('login');

      // ✅ Sidebar SOLO en "Mi cuenta" 
    
      // ❌ Footer NO en admin
      const isAdminRoute =
        url.startsWith('/inicio') ||
        url.startsWith('/add_product') ||
        url.startsWith('/inventory') ||
        url.startsWith('/reports') ||
        url.startsWith('/users') ||
        url.startsWith('/perfil') || 
        url.startsWith('/resume') || 
        url.startsWith('/orders');

      this.showFooter = !isAdminRoute && this.showLayout;
    });
  }
}
