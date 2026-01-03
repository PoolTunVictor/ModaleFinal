import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { ProductService } from '../../../core/service/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct {

  productForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category_id: [null, Validators.required],
      stock: [0, [Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  // 🔹 Submit del formulario
  onSubmit() {
    if (this.productForm.invalid) {
      this.errorMessage = '❌ Completa todos los campos obligatorios';
      this.successMessage = '';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.productForm.value;

    const product = {
      ...formValue,
      category_id: Number(formValue.category_id)
    };

    this.productService.createProduct(product).subscribe({
      next: () => {
        this.loading = false;

        // 🔥 LOG DE ACTIVIDAD
        this.saveActivity('add', product.name);

        this.successMessage = '✅ El producto se agregó correctamente';

        this.productForm.reset({
          name: '',
          category_id: null,
          stock: 0,
          price: 0,
          description: ''
        });

        setTimeout(() => {
          this.successMessage = '';
        }, 600);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || '❌ No se pudo agregar el producto';

        setTimeout(() => {
          this.errorMessage = '';
        }, 600);
      }
    });
  }

  // 🔵 Guardar actividad
  saveActivity(type: 'add' | 'edit', name: string) {
    const data = localStorage.getItem('activity_log');
    const activity = data ? JSON.parse(data) : [];

    activity.unshift({
      type,
      message: `Producto agregado: "${name}"`,
      date: new Date().toLocaleString()
    });

    localStorage.setItem(
      'activity_log',
      JSON.stringify(activity.slice(0, 10))
    );
  }
}
