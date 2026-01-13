import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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

  allProducts: Product[] = [];
  latestProducts: Product[] = [];
  visibleProducts: Product[] = [];

  private intervalId: any;
  private showFirstGroup = true;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    // 👂 escuchar cambios en el buscador
    this.route.queryParams.subscribe(params => {
      const query = params['q']?.toLowerCase() || '';
      this.applyFilter(query);
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {

      this.allProducts = products;

      this.latestProducts = [...products]
        .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
        .slice(0, 12);

      this.visibleProducts = this.latestProducts.slice(0, 6);
      this.startRotation();
    });
  }

  applyFilter(query: string) {
    // ⬅️ limpiar rotación si se busca
    if (this.intervalId) clearInterval(this.intervalId);

    if (!query) {
      // volver a comportamiento normal
      this.visibleProducts = this.latestProducts.slice(0, 6);
      this.startRotation();
      return;
    }

    this.visibleProducts = this.allProducts.filter(p =>
      p.name.toLowerCase().includes(query)
    );
  }

  startRotation(): void {
    this.intervalId = setInterval(() => {
      this.visibleProducts = this.showFirstGroup
        ? this.latestProducts.slice(6, 12)
        : this.latestProducts.slice(0, 6);

      this.showFirstGroup = !this.showFirstGroup;
    }, 4000);
  }
}