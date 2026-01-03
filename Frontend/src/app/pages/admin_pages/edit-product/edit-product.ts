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
import { Product } from '../../../core/interface/product';

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

  loading = false;
  errorMessage = '';
  successMessage = '';

  categories = [
    { id: 1, name: 'Maquillaje' },
    { id: 2, name: 'Perfumes' },
    { id: 3, name: 'Prendas' },
    { id: 4, name: 'Cuidado facial' },
    { id: 5, name: 'Cuidado corporal' },
    { id: 6, name: 'Accesorios' }
  ];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.buildForm();
    this.loadProduct();
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      category_id: [null, Validators.required],
      stock: [0, [Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  loadProduct(): void {
    this.loading = true;

    this.productService.getProductById(this.productId).subscribe({
      next: (product: Product) => {
        this.form.patchValue({
          name: product.name,
          category_id: product.category_id,
          stock: product.stock,
          price: product.price,
          description: product.description
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

    const payload = {
      ...this.form.value,
      category_id: Number(this.form.value.category_id)
    };

    this.productService.updateProduct(this.productId, payload).subscribe({
      next: (updatedProduct: Product) => {

        // 🔥 LOG DE ACTIVIDAD
        this.saveActivity('edit', updatedProduct.name);

        this.router.navigate(
          ['/admin/inventory'],
          { state: { updatedProduct } }
        );
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

  // 🔵 Guardar actividad
  saveActivity(type: 'add' | 'edit', name: string) {
    const data = localStorage.getItem('activity_log');
    const activity = data ? JSON.parse(data) : [];

    activity.unshift({
      type,
      message: `Producto editado: "${name}"`,
      date: new Date().toLocaleString()
    });

    localStorage.setItem(
      'activity_log',
      JSON.stringify(activity.slice(0, 10))
    );
  }
}
