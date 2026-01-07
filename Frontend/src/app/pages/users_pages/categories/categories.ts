import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../../../../shared/banner/banner';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, BannerComponent],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent {}
