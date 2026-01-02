import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../layouts/navbar/navbar.component';
import { Footer } from './layouts/footer/footer';
import { UserSidebarComponent } from '../layouts/user_sidebar/user-sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    Footer,
    UserSidebarComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  protected readonly title = signal('ModAle');

  // Estados de layout
  showLayout = true;        // navbar
  showUserSidebar = false; // sidebar usuario
  showFooter = true;       // footer

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;

      // ❌ Login: nada de layout
      this.showLayout = !url.includes('login');

      // ✅ Sidebar SOLO en "Mi cuenta"
      this.showUserSidebar = url.startsWith('/perfil') || url.startsWith('/resume') || url.startsWith('/orders');

      // ❌ Footer NO en admin
      const isAdminRoute =
        url.startsWith('/inicio') ||
        url.startsWith('/add_product') ||
        url.startsWith('/inventory') ||
        url.startsWith('/reports') ||
        url.startsWith('/users');

      this.showFooter = !isAdminRoute && this.showLayout;
    });
  }
}
