import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { ProductService } from '../../../core/service/product.service';
import { Product } from '../../../core/interface/product';

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
    // 🔹 Formulario alineado con backend
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

        // ✅ mostrar mensaje
        this.successMessage = '✅ El producto se agregó correctamente';

        // limpiar formulario
        this.productForm.reset({
          name: '',
          category_id: null,
          stock: 0,
          price: 0,
          description: ''
        });

        // 🔥 ocultar mensaje automáticamente
        setTimeout(() => {
          this.successMessage = '';
        }, 600); // tiempo
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || '❌ No se pudo agregar el producto';

        // ocultar error también si quieres
        setTimeout(() => {
          this.errorMessage = '';
        }, 600);
      }
    });
  }
}
