import { Component } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { Dashboard } from '../../shared/dashboard/admin_dashboard';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Dashboard, Footer],
  standalone:true,
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
