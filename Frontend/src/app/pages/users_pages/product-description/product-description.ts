import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ProductCard } from '../product-card/product-card';
import { ProductService } from '../../../core/service/product.service';
import { Product } from '../../../core/interface/product';
import { CartService } from '../../../core/service/cart.service';

@Component({
  selector: 'app-product-description',
  standalone: true,
  imports: [
    CommonModule,
    ProductCard
  ],
  templateUrl: './product-description.html',
  styleUrl: './product-description.css'
})
export class ProductDescriptionComponent {

  product?: Product;
  recommendedProducts: Product[] = [];
  features: string[] = [];


  quantity = 1;
  loading = true;

  // 🔴 MODAL STOCK
  showStockModal = false;
  stockMessage = '';
  showAddedModal = false;

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      if (id) {
        this.loading = true;
        this.quantity = 1; // 🔁 reset al cambiar de producto

        this.productService.getProductById(id).subscribe(product => {
          this.product = product;
          this.loading = false;
           // 🔥 CONVERTIR DESCRIPCIÓN A LISTA
          this.features = product.description
            ? product.description
                .split('\n')           // separa por saltos de línea
                .map(f => f.trim())
                .filter(f => f.length > 0)
            : [];

          this.recommendedProducts = [];
          this.loadRecommended(product.category_id);
        });
      }
    });
  }

  loadRecommended(categoryId: number) {
    this.productService
      .getProductsByCategory(categoryId)
      .subscribe((products: Product[]) => {
        this.recommendedProducts = products
          .filter(p => p.id !== this.product?.id)
          .slice(0, 7);
      });
  }

  // ➕ AUMENTAR (respeta stock)
  increase() {
    if (!this.product) return;

    const stock = this.product.stock ?? 0;

    if (this.quantity < stock) {
      this.quantity++;
    } else {
      this.stockMessage = 'No hay más unidades disponibles para este producto.';
      this.showStockModal = true;
    }
  }


  // ➖ DISMINUIR
  decrease() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // 🛒 AGREGAR AL CARRITO
    addToCart() {
      if (!this.product) return;

      const ok = this.cartService.addProduct(this.product, this.quantity);

      if (!ok) {
        this.stockMessage = 'No hay suficiente stock disponible para agregar esta cantidad.';
        this.showStockModal = true;
        return;
      }

      // ✅ PRODUCTO AGREGADO CORRECTAMENTE
      this.showAddedModal = true;

      // opcional: reset cantidad
      this.quantity = 1;
    }

  // ❌ CERRAR MODAL
  closeModal() {
    this.showStockModal = false;
  }

  closeAddedModal() {
  this.showAddedModal = false;
}
}
