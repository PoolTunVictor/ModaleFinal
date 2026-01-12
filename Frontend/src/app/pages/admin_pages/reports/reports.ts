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
  salesChart: any;

  constructor(
    private adminReportService: AdminReportService
  ) {}

  ngOnInit(): void {
    this.loadReport();
    this.loadSalesChart();
  }

  loadReport() {
    this.isLoading = true;

    this.adminReportService.getSummary().subscribe({
      next: (data) => {
        this.report = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadSalesChart() {
    this.adminReportService.getSalesByDay().subscribe(data => {

      const labels = data.map(d => d.date);
      const totals = data.map(d => d.total);

      const ctx = document.getElementById('salesChart') as HTMLCanvasElement;

      if (this.salesChart) {
        this.salesChart.destroy();
      }

      this.salesChart = new Chart(ctx, {
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
