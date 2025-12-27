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
    Footer
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  protected readonly title = signal('ModAle');
  showLayout = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.showLayout = !this.router.url.includes('login');
    });
  }
}
