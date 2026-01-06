import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { ProductService } from '../../../core/service/product.service';
import { ProductImageService } from '../../../core/service/product-image.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct {

  productForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private productImageService: ProductImageService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category_id: [null, Validators.required],
      stock: [0, [Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  // 📸 Capturar imagen
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // 🚀 Submit
  onSubmit() {
    if (this.productForm.invalid) {
      this.errorMessage = 'Completa los campos obligatorios';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const product = {
      ...this.productForm.value,
      category_id: Number(this.productForm.value.category_id)
    };

    this.productService.createProduct(product).subscribe({
      next: (createdProduct: any) => {

        const productId = createdProduct.id || createdProduct?.data?.id;

        // 👉 Si hay imagen, la subimos
        if (this.selectedFile && productId) {
          this.productImageService
            .uploadImage(productId, this.selectedFile, true, '') // 👈 token vacío (temporal)
            .subscribe({
              next: () => {
                this.finishSuccess(product.name);
              },
              error: () => {
                this.loading = false;
                this.errorMessage =
                  'Producto creado, pero error al subir la imagen';
              }
            });
        } else {
          this.finishSuccess(product.name);
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo agregar el producto';
      }
    });
  }

  finishSuccess(name: string) {
    this.loading = false;
    this.successMessage = `Producto "${name}" agregado correctamente`;
    this.productForm.reset();
    this.selectedFile = null;
  }
}
