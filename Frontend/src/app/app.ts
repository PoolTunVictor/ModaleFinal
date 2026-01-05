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
  showRegister = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;

      // ❌ Login: nada de layout
      this.showLayout = !url.includes('login') && !url.includes ('register') && !url.includes ('recovery');
      //this.showRegister =  !url.includes ('register');

      // ✅ Sidebar SOLO en "Mi cuenta" 
    
      // ❌ Footer NO en admin
      const isAdminRoute =
        url.startsWith('/admin/inicio') ||
        url.startsWith('/admin/add_product') ||
        url.startsWith('/admin/inventory') ||
        url.startsWith('/admin/reports') ||
        url.startsWith('/admin/users') ||
        url.startsWith('/user/perfil') || 
        url.startsWith('/user/resume') || 
        url.startsWith('/user/orders');

      this.showFooter = !isAdminRoute && this.showLayout;
    });
  }
}
