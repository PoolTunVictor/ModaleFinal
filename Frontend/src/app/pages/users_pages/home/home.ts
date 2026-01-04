import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductService } from '../../../core/service/product.service';
import { Product } from '../../../core/interface/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  latestProducts: Product[] = [];   // últimos 9
  visibleProducts: Product[] = []; // los que se muestran ahora

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

      // 🔥 ordenar por más reciente (id alto = más nuevo)
    this.latestProducts = products
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
      .slice(0, 9);


      // mostrar primeros 5
      this.visibleProducts = this.latestProducts.slice(0, 5);

      // iniciar transición
      this.startRotation();
    });
  }

  startRotation(): void {
    this.intervalId = setInterval(() => {
      if (this.showFirstGroup) {
        this.visibleProducts = this.latestProducts.slice(5, 9); // 4
      } else {
        this.visibleProducts = this.latestProducts.slice(0, 5); // 5
      }
      this.showFirstGroup = !this.showFirstGroup;
    }, 4000); // ⏱ cada 4 segundos
  }
}
