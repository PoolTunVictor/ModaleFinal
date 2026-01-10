import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from '../layouts/navbar/navbar.component';
import { Footer } from './layouts/footer/footer';
import { UserSidebarComponent } from '../layouts/user_sidebar/user-sidebar.component'

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
  showLayout = true;        // navbar cliente
  showUserSidebar = false; // sidebar usuario
  showFooter = true;       // footer cliente

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {

        const url = event.urlAfterRedirects;

        const isAdminRoute = url.startsWith('/admin');
        const isLoginRoute = url.startsWith('/login');

        // 🔹 Navbar y footer SOLO para cliente
        this.showLayout = !isAdminRoute && !isLoginRoute;
        this.showFooter = !isAdminRoute && !isLoginRoute;

        // 🔹 Sidebar usuario SOLO en perfil
        this.showUserSidebar = url.startsWith('/perfil') && !isAdminRoute;

      });
  }
}
