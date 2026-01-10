import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../../core/interface/product';
import { CartService } from '../../../core/service/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard {

  @Input() product!: Product;

  // 🔔 mensaje flotante
  showFloatingMessage = false;
  floatingMessage = '';

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  addToCart(event: Event) {
    event.stopPropagation(); // 🚫 no navegar al detalle

    const ok = this.cartService.addProduct(this.product, 1);

    if (ok) {
      this.floatingMessage = 'Producto agregado al carrito';
    } else {
      this.floatingMessage = 'No hay más stock disponible';
    }

    this.showFloatingMessage = true;

    // ⏱️ ocultar automáticamente
    setTimeout(() => {
      this.showFloatingMessage = false;
    }, 2000);
  }

  goToDetail() {
    this.router.navigate(['/producto', this.product.id]);
  }
}
