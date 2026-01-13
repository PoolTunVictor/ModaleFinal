import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminReportService } from '../../../core/service/admin-report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {

  report: any = null;
  isLoading = true;

  tableMode: 'top' | 'least' | 'all' = 'top';
  displayedProducts: any[] = [];

  constructor(private adminReportService: AdminReportService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport() {
    this.isLoading = true;

    this.adminReportService.getSummary().subscribe({
      next: (data) => {
        this.report = data;
        this.applyTableMode();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyTableMode() {
    if (!this.report || !this.report.products) return;

    const products = [...this.report.products];

    // TOP: 20 unidades o más
    if (this.tableMode === 'top') {
      this.displayedProducts = products
        .filter(p => p.units >= 20)
        .sort((a, b) => b.units - a.units);
    }

    // MENOS VENDIDOS: 5 unidades o menos
    if (this.tableMode === 'least') {
      this.displayedProducts = products
        .filter(p => p.units <= 5)
        .sort((a, b) => a.units - b.units);
    }

    // TODOS
    if (this.tableMode === 'all') {
      this.displayedProducts = products
        .sort((a, b) => b.units - a.units);
    }
  }

}
