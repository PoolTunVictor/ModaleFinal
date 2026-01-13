import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/service/cart.service';
import { OrderService } from '../../../core/service/order.service';
import { AuthService } from '../../../core/service/auth.service';
import { AddressService } from '../../../core/service/address.service';
import { Address } from '../../../core/interface/address';
import { BannerComponent } from '../../../../shared/banner/banner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, BannerComponent, FormsModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {

  // =========================
  // DIRECCIONES
  // =========================
  addresses: Address[] = [];
  selectedAddressId: number | null = null;
  isLoadingAddresses = true;

  showAddressForm = false;

  // =========================
  // MODAL
  // =========================
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalAction: (() => void) | null = null;

  newAddress = {
    receiver_name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    references: '',
    is_default: false
  };

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private addressService: AddressService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // =========================
  // INIT
  // =========================
ngOnInit() {

    this.route.queryParams.subscribe(params => {

      // ➕ Nueva dirección
      if (params['newAddress']) {
        this.showAddressForm = true;
      }

      // ✏️ Editar dirección
      if (params['editAddress']) {
        const id = Number(params['editAddress']);
        this.loadAddressForEdit(id);
      }

    });

    if (this.authService.isLoggedIn()) {
      this.loadAddresses();
    } else {
      this.isLoadingAddresses = false;
    }
  }

  // =========================
  // LOGIN HELPERS (para HTML)
  // =========================
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  goToLogin() {
    localStorage.setItem('redirectAfterLogin', '/carrito');
    this.router.navigate(['/login']);
  }

  // =========================
  // CARGAR DIRECCIONES
  // =========================
  loadAddresses() {
    this.isLoadingAddresses = true;

    this.addressService.getMyAddresses().subscribe({
      next: (res) => {
        this.addresses = res;

        const defaultAddress = this.addresses.find(a => a.is_default);
        if (defaultAddress) {
          this.selectedAddressId = defaultAddress.id;
        }

        this.isLoadingAddresses = false;
      },
      error: () => {
        this.isLoadingAddresses = false;
        alert('Error al cargar direcciones');
      }
    });
  }

  // =========================
  // GUARDAR DIRECCIÓN
  // =========================
  saveAddress() {

    const {
      receiver_name,
      phone,
      street,
      city,
      state,
      postal_code,
      references
    } = this.newAddress;

    if (
      !receiver_name ||
      !phone ||
      !street ||
      !city ||
      !state ||
      !postal_code ||
      !references
    ) {
      alert('Completa todos los campos de la dirección');
      return;
    }

    // 🔐 PASO 1 — No logueado → guardar borrador y redirigir
    if (!this.authService.isLoggedIn()) {
      localStorage.setItem('draftAddress', JSON.stringify(this.newAddress));
      localStorage.setItem('redirectAfterLogin', '/carrito');
      this.router.navigate(['/login']);
      return;
    }

    // 🟢 Logueado → guardar normal
    this.addressService.createAddress(this.newAddress).subscribe({
      next: (createdAddress) => {
        this.openModal(
          'Dirección guardada',
          'La dirección se guardó correctamente.'
        );

        this.showAddressForm = false;

        this.newAddress = {
          receiver_name: '',
          phone: '',
          street: '',
          city: '',
          state: '',
          postal_code: '',
          references: '',
          is_default: false
        };

        // 🧹 limpiar borrador
        localStorage.removeItem('draftAddress');

        this.loadAddresses();
        this.selectedAddressId = createdAddress.id;
      }
    });
  }

  // =========================
  // CARRITO
  // =========================
  get cartItems() {
    return this.cartService.getCart();
  }

  getTotal() {
    return this.cartService.getTotal();
  }

  // =========================
  // CREAR PEDIDO
  // =========================
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

    if (!this.selectedAddressId) {
      alert('Selecciona o crea una dirección de envío');
      return;
    }

    this.orderService.createOrder(this.selectedAddressId).subscribe({
      next: () => {
        this.openModal(
          'Pedido generado',
          'Tu pedido fue creado correctamente.',
          () => {
            this.cartService.clear();
            this.router.navigate(['/mis-pedidos']);
          }
        );
      },
      error: (err) => {
        alert(err.error?.message || 'Error al generar pedido');
      }
    });
  }

  openModal(title: string, message: string, action?: () => void) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalAction = action || null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.modalAction = null;
  }

  confirmModal() {
    if (this.modalAction) {
      this.modalAction();
    }
    this.closeModal();
  }

  loadAddressForEdit(id: number) {
  const address = this.addresses.find(a => a.id === id);
  if (!address) return;

  this.newAddress = {
    receiver_name: address.receiver_name,
    phone: address.phone,
    street: address.street,
    city: address.city,
    state: address.state,
    postal_code: address.postal_code,
    references: address.references || '',
    is_default: address.is_default
  };

  this.selectedAddressId = address.id;
  this.showAddressForm = true;
}

}
