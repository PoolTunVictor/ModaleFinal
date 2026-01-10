import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/service/cart.service';
import { OrderService } from '../../../core/service/order.service';
import { AuthService } from '../../../core/service/auth.service';
import { BannerComponent } from '../../../../shared/banner/banner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, BannerComponent, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {

  address = {
    receiver_name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    references: ''
  };

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  get cartItems() {
    return this.cartService.getCart();
  }

  getTotal() {
    return this.cartService.getTotal();
  }

  generateOrder() {

    if (!this.authService.isLoggedIn()) {
      localStorage.setItem('redirectAfterLogin', '/carrito');
      this.router.navigate(['/login']);
      return;
    }

    if (this.cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // 🔴 VALIDACIÓN DE CAMPOS
    const {
      receiver_name,
      phone,
      street,
      city,
      state,
      postal_code
    } = this.address;

    if (
      !receiver_name ||
      !phone ||
      !street ||
      !city ||
      !state ||
      !postal_code
    ) {
      alert('Por favor completa todos los datos de envío');
      return;
    }

    // ✅ AHORA SÍ, POST
    this.orderService.createOrder(this.address).subscribe({
      next: () => {
        alert('Pedido generado correctamente');
        this.router.navigate(['/mis-pedidos']);
      },
      error: (err) => {
        alert(err.error?.message || 'Error al generar pedido');
      }
    });
  }
}
