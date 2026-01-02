import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserSidebarComponent } from '../../shared/user_sidebar/user-sidebar.component';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-side',
  imports: [UserSidebarComponent, Footer, RouterOutlet],
  standalone:true,
  templateUrl: './user.layout.html',
  styleUrl: './user.layout.css',
})
export class UserSide {

}
