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
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const product: Product = this.productForm.value;

    this.loading = true;
    this.errorMessage = '';

    this.productService.createProduct(product).subscribe({
      next: (res) => {
        console.log('Producto creado:', res);

        // reset form
        this.productForm.reset({
          stock: 0,
          price: 0
        });

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          err.error?.message || 'Error al crear el producto';
        this.loading = false;
      }
    });
  }
}
