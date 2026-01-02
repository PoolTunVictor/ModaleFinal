import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RouterLinkActive],
  standalone:true,
  templateUrl: './admin_dashboard.html',
  styleUrl: './admin_dashboard.css',
})
export class Dashboard {

}
