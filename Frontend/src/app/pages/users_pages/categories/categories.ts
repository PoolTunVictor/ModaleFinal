import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <--- IMPORTANTE

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule], // <--- AGREGAR AQUÍ
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent { }
