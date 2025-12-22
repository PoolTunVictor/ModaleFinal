import { Component } from '@angular/core';
import { ProductCard } from '../../../components/product-card/product-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent { 
}