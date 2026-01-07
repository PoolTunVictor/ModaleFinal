import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,                 // 👈 CLAVE
  imports: [CommonModule],           // 👈 CLAVE
  templateUrl: './banner.html',
  styleUrls: ['./banner.css']
})
export class BannerComponent {

  @Input() title: string = '';
  @Input() subtitle?: string;

}
