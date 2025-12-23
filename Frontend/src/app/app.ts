import { Component, signal } from '@angular/core';
import { Route, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../layouts/navbar/navbar.component';
import { UserSidebarComponent } from '../layouts/user_sidebar/user-sidebar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent,UserSidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ModAle');

  constructor (private router: Router){}
  get showLayout(): boolean{
    const currentUrl = this.router.url;
    return !(currentUrl.includes('/login') || currentUrl.includes('/register'));
  }
}
