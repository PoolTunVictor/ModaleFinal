import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProductService } from '../../../core/service/product.service';
import { Product } from '../../../core/interface/product';
import { ProductCard } from '../product-card/product-card';


@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './category-detail.html',
  styleUrls: ['./category-detail.css']
})
export class CategoryDetailComponent implements OnInit {

  categoryName: string = '';
  products: Product[] = [];

  // 🔥 Mapa SLUG → ID (BD)
  categoryMap: Record<string, number> = {
    'accesorios': 6,
    'maquillaje': 1,
    'prendas': 3,
    'cuidado-corporal': 5,
    'cuidado-facial': 4,
    'perfumes': 2
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryName = params['nombre'];
      this.loadProducts();
    });
  }

  loadProducts(): void {
    const categoryId = this.categoryMap[this.categoryName];

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products.filter(
          p => p.category_id === categoryId
        );
      },
      error: () => {
        this.products = [];
      }
    });
  }
}
