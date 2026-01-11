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
        this.orders = res.map(order => ({
          id: order.order_number,
          date: new Date(order.created_at).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          status: this.mapStatus(order.status),
          items: [], // 👈 luego si quieres imágenes reales
          extra: 0,
          total: order.total,
          action: this.mapAction(order.status)
        }));

        this.isLoading = false;
      },
      error: () => {
        alert('Error al cargar pedidos');
        this.isLoading = false;
      }
    });
  }

  // =========================
  // FILTRO
  // =========================
  get filteredOrders() {
    if (this.selectedFilter === 'Todos') {
      return this.orders;
    }
    return this.orders.filter(
      order => order.status === this.selectedFilter
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

  mapAction(status: string): string {
    switch (status) {
      case 'entregado':
        return 'Ver detalles';
      case 'confirmado':
      case 'pendiente':
        return 'Rastrear pedido';
      default:
        return 'Ver pedido';
    }
  }
}
