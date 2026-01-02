import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user_dashboard.html',
  styleUrls: ['./user_dashboard.css']
})
export class UserSidebarComponent {
  userName = 'Jaqueline Uc';
}