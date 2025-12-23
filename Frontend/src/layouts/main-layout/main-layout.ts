import { Component } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { Dashboard } from '../../shared/dashboard/dashboard';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Dashboard, Footer],
  standalone:true,
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
