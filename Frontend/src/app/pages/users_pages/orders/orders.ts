import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../../../shared/banner/banner';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, BannerComponent],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent {

  selectedFilter: string = 'Todos';

  orders = [
    {
      id: 'ORD-7829',
      date: '24 Oct, 2023',
      status: 'Entregado',
      items: [
        'assets/product_description/moños.png',
        'assets/product_description/gio.png'
      ],
      extra: 2,
      total: 124.50,
      action: 'Ver detalles'
    },
    {
      id: 'ORD-7830',
      date: '02 Nov, 2023',
      status: 'En proceso',
      items: [
        'assets/product_description/garnier.png'
      ],
      total: 45.00,
      action: 'Rastrear pedido'
    },
    {
      id: 'ORD-7812',
      date: '15 Oct, 2023',
      status: 'Enviado',
      items: [
        'assets/product_description/miss-dior.png',
        'assets/product_description/gio.png'
      ],
      total: 280.00,
      action: 'Rastrear paquete'
    }
  ];

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
}
