import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; // 1. Agregamos RouterModule aquí
import { CommonModule } from '@angular/common'; // 2. Agregamos CommonModule para pipes y directivas
import { ProductCard } from '../../../components/product-card/product-card';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  // 3. AGREGAMOS CommonModule y RouterModule a la lista de imports
  imports: [CommonModule, RouterModule, ProductCard], 
  templateUrl: './category-detail.html',
  styleUrls: ['./category-detail.css']
})
export class CategoryDetailComponent implements OnInit {
  categoryName: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Captura el nombre de la categoría de la URL
    this.route.params.subscribe(params => {
      this.categoryName = params['nombre'];
    });
  }
}