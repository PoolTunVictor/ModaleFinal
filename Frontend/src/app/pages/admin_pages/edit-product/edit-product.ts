import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../../core/service/product.service';
import { CategoryService } from '../../../core/service/category.service';

import { Product } from '../../../core/interface/product';
import { Category } from '../../../core/interface/category';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProduct implements OnInit {

  productId!: number;
  form!: FormGroup;

  categories: Category[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.buildForm();
    this.loadCategories();
    this.loadProduct();
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      category_id: [null, Validators.required] // 👈 AHORA SÍ
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        // opcional: solo categorías activas
        this.categories = categories.filter(c => c.is_active);
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las categorías';
      }
    });
  }

  loadProduct(): void {
    this.loading = true;

    this.productService.getProductById(this.productId).subscribe({
      next: (product: Product) => {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          stock: product.stock,
          price: product.price,
          category_id: product.category_id
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el producto';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    this.productService
      .updateProduct(this.productId, this.form.value)
      .subscribe({
        next: () => {
          this.successMessage = 'Producto actualizado correctamente';
          setTimeout(() => {
            this.router.navigate(['/admin/inventory']);
          }, 1200);
        },
        error: () => {
          this.errorMessage = 'Error al actualizar el producto';
          this.loading = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/admin/inventory']);
  }

  
}
