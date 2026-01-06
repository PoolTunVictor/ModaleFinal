import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './address-cards.component.html',
  styleUrls: ['./address-cards.component.css']
})
export class AddressCardsComponent {

  addresses = [
    {
      label: 'Predeterminada',
      title: 'Casa',
      name: 'María González',
      address: 'Av. Reforma 222, Piso 5',
      city: 'Col. Juárez, Ciudad de México, CDMX, 06600',
      phone: '+52 55 1234 5678',
      primary: true
    },
    {
      label: 'Trabajo',
      title: 'Oficina',
      name: 'María González',
      address: 'Calle 5 de Mayo 404, Centro',
      city: 'Monterrey, NL, 64000',
      phone: '+52 81 8765 4321'
    },
    {
      label: 'Casa de Mamá',
      title: 'Casa de Mamá',
      name: 'Sofía González',
      address: 'Av. Vallarta 2440, Arcos Vallarta',
      city: 'Guadalajara, Jal, 44130',
      phone: '+52 33 3615 8899'
    }
  ];

}
