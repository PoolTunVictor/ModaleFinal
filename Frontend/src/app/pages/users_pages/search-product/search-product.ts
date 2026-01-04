import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../../../core/service/product.service';
import { Product } from '../../../core/interface/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './search-product.html',
  styleUrls: ['./search-product.css']
})
export class SearchProductComponent implements OnInit {

  query = '';
  results: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = (params['q'] || '').toString().trim();

      if (this.query) {
        this.searchProducts();
      } else {
        this.results = [];
      }
    });
  }

  searchProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.results = products.filter(p =>
        p.name?.toLowerCase().includes(this.query.toLowerCase())
      );
    });
  }
}
