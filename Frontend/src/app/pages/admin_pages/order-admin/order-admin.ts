import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminOrderService } from '../../../core/service/admin-order.service';

@Component({
  selector: 'app-order-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-admin.html',
  styleUrls: ['./order-admin.css']
})
export class OrderAdmin implements OnInit {

  orders: any[] = [];
  isLoading = true;

  showPrintModal = false;
  selectedOrder: any = null;

  constructor(private adminOrderService: AdminOrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.adminOrderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  changeStatus(orderId: number, status: string) {
    this.adminOrderService.updateOrderStatus(orderId, status).subscribe(() => {
      this.loadOrders();
    });
  }

  deleteOrder(orderId: number) {
    if (!confirm('¿Eliminar este pedido?')) return;

    this.adminOrderService.deleteOrder(orderId).subscribe(() => {
      this.loadOrders();
    });
  }

  openPrintModal(order: any) {
    this.adminOrderService.getOrderDetail(order.id).subscribe({
      next: (fullOrder) => {
        this.selectedOrder = fullOrder;
        this.showPrintModal = true;
      }
    });
  }


  closePrintModal() {
    this.showPrintModal = false;
    this.selectedOrder = null;
  }

  print() {
    setTimeout(() => {
      window.print();
    }, 300);
  }
}