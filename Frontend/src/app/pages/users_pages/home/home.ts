import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductService } from '../../../core/service/product.service';
import { Product } from '../../../core/interface/product';
import { ProductCard } from '../product-card/product-card';
import { BannerComponent } from '../../../../shared/banner/banner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCard, BannerComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  latestProducts: Product[] = [];
  visibleProducts: Product[] = [];

  private intervalId: any;
  private showFirstGroup = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadLatestProducts();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadLatestProducts(): void {
    this.productService.getProducts().subscribe(products => {

      // 🔥 últimos 12
      this.latestProducts = products
        .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
        .slice(0, 12);

      // 🔥 primeros 6
      this.visibleProducts = this.latestProducts.slice(0, 6);

      this.startRotation();
    });
  }

  startRotation(): void {
    this.intervalId = setInterval(() => {

      if (this.showFirstGroup) {
        // 👉 productos 7 al 12
        this.visibleProducts = this.latestProducts.slice(6, 12);
      } else {
        // 👉 productos 1 al 6
        this.visibleProducts = this.latestProducts.slice(0, 6);
      }

      this.showFirstGroup = !this.showFirstGroup;

    }, 4000); // cada 4 segundos
  }

}
