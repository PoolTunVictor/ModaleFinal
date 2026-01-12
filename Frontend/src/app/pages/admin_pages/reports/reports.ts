import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminReportService } from '../../../core/service/admin-report.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {

  report: any = null;
  isLoading = true;
  salesChart: Chart | null = null;

  constructor(
    private adminReportService: AdminReportService
  ) {}

  ngOnInit(): void {
    this.loadReport();

    // Esperamos a que el HTML ya esté renderizado
    setTimeout(() => {
      this.loadSalesChart();
    }, 0);
  }

  loadReport(): void {
    this.isLoading = true;

    this.adminReportService.getSummary().subscribe({
      next: (data: any) => {
        this.report = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadSalesChart(): void {
    this.adminReportService.getSalesByDay().subscribe((data: any[]) => {

      const labels = data.map((d: any) => d.date);
      const totals = data.map((d: any) => d.total);

      const canvas = document.getElementById('salesChart') as HTMLCanvasElement | null;

      if (!canvas) {
        return;
      }

      if (this.salesChart) {
        this.salesChart.destroy();
      }

      this.salesChart = new Chart(canvas, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Ventas ($)',
              data: totals,
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34,197,94,0.2)',
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }

}
