import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminReportService } from '../../../core/service/admin-report.service';

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

  constructor(private adminReportService: AdminReportService) {}

  ngOnInit(): void {
    this.loadReport();
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
}
