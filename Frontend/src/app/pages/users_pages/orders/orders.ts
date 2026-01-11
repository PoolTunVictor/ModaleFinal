import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../../../shared/banner/banner';
import { OrderService } from '../../../core/service/order.service';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, BannerComponent],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {

  selectedFilter: string = 'Todos';
  isLoading = true;

  orders: any[] = [];

  // 🔥 NUEVO → pedido seleccionado para el modal
  selectedOrder: any = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.loadOrders();
    } else {
      this.isLoading = false;
    }
  }

  // =========================
  // CARGAR PEDIDOS
  // =========================
  loadOrders() {
    this.isLoading = true;

    this.orderService.getMyOrders().subscribe({
      next: (res) => {

        this.orders = res.map(order => {

          const images = order.items
            ?.map((item: any) => item.product_image)
            .filter((img: string | null) => !!img)
            .slice(0, 3);

          return {
            ...order, // 🔥 conservamos todo el pedido
            id: order.order_number,
            date: new Date(order.created_at).toLocaleDateString('es-MX', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }),
            statusLabel: this.mapStatus(order.status),
            itemsPreview: images,
            extra: order.items.length - images.length,
            action: 'Ver detalles'
          };
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar pedidos:', err);
        alert('Error al cargar pedidos');
        this.isLoading = false;
      }
    });
  }

  // =========================
  // MODAL
  // =========================
  openOrder(order: any) {
    this.selectedOrder = order;
  }

  closeModal() {
    this.selectedOrder = null;
  }

  // =========================
  // FILTRO
  // =========================
  get filteredOrders() {
    if (this.selectedFilter === 'Todos') {
      return this.orders;
    }
    return this.orders.filter(
      order => order.statusLabel === this.selectedFilter
    );
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  // =========================
  // HELPERS
  // =========================
  mapStatus(status: string): string {
    switch (status) {
      case 'pendiente':
        return 'En proceso';
      case 'confirmado':
        return 'Enviado';
      case 'entregado':
        return 'Entregado';
      default:
        return status;
    }
  }
}
