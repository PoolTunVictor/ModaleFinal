import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../app/core/service/auth.service';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user_dashboard.html',
  styleUrls: ['./user_dashboard.css']
})
export class UserSidebarComponent {
  userName = 'Jaqueline Uc';constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();   // 🔥 limpia token + user
    this.router.navigate(['/login']); // 🔁 redirige
  }
}