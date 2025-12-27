import { Component, signal } from '@angular/core';
<<<<<<< HEAD
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../layouts/navbar.component';
import { Footer } from './layouts/footer/footer';
=======
import { Route, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../layouts/navbar/navbar.component';
import { UserSidebarComponent } from '../layouts/user_sidebar/user-sidebar.component';
import { Router } from '@angular/router';
>>>>>>> login

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [
    RouterOutlet,
    NavbarComponent,
    Footer
  ],
=======
  imports: [RouterOutlet, NavbarComponent,UserSidebarComponent],
>>>>>>> login
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('ModAle');

  constructor (private router: Router){}
  get showLayout(): boolean{
    const currentUrl = this.router.url;
    return !(currentUrl.includes('/login') || currentUrl.includes('/register'));
  }
}
