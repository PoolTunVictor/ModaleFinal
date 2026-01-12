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
    const printContent = document.getElementById('printArea');
    if (!printContent) return;

    const win = window.open('', '', 'width=900,height=650');

    win!.document.write(`
      <html>
        <head>
          <title>Ficha de Entrega</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }

            section {
              page-break-inside: avoid;
              margin-bottom: 16px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th, td {
              border: 1px solid #000;
              padding: 6px;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    win!.document.close();
    win!.focus();

    setTimeout(() => {
      win!.print();
      win!.close();
    }, 300);
  }


}