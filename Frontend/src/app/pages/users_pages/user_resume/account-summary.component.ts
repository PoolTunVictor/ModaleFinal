import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css']
})
export class AccountSummaryComponent {

  orders = [
    {
      id: '#ORD-7829',
      date: '24 Oct, 2023',
      status: 'Entregado',
      total: 124.50,
      action: 'Ver detalles'
    },
    {
      id: '#ORD-7830',
      date: '02 Nov, 2023',
      status: 'En proceso',
      total: 45.00,
      action: 'Rastrear pedido'
    },
    {
      id: '#ORD-7812',
      date: '15 Oct, 2023',
      status: 'Enviado',
      total: 280.00,
      action: 'Rastrear paquete'
    }
  ];

  user = {
    name: 'Jaqueline Uc',
    email: 'jaqui@gmail.com',
    phone: '9962003955'
  };

  address = {
    title: 'Casa',
    text: 'Calle 18 SN La Soledad, Pomuch, Campeche, México. 24810'
  };
}
