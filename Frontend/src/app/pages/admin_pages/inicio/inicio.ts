import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProductService } from '../../../core/service/product.service';
import { Product } from '../../../core/interface/product';

interface Activity {
  type: 'add' | 'edit';
  message: string;
  date: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {

  // 🔴 Productos con bajo stock
  lowStockProducts: Product[] = [];

  // 🔵 Actividad reciente
  recentActivity: Activity[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadLowStockProducts();
    this.loadRecentActivity();
  }

  // 📦 Cargar productos con stock bajo (≤ 5)
  loadLowStockProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.lowStockProducts = products.filter(
          product => (product.stock ?? 0) <= 5
        );

      },
      error: () => {
        this.lowStockProducts = [];
      }
    });
  }

  // 🕒 Cargar actividad reciente desde localStorage
  loadRecentActivity(): void {
    const data = localStorage.getItem('activity_log');
    this.recentActivity = data
      ? JSON.parse(data).slice(0, 5)
      : [];
  }
}
