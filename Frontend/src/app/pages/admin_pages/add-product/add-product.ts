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

  // 📤 Enviar formulario
  onSubmit() {
    if (this.productForm.invalid) {
      this.errorMessage = '❌ Completa todos los campos obligatorios';
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
      next: (createdProduct: any) => {

        if (this.selectedFile) {
          this.uploadProductImage(createdProduct.id, product.name);
        } else {
          this.finishSuccess(product.name);
        }

      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || '❌ No se pudo agregar el producto';
      }
    });
  }

  // ☁️ Subir imagen usando ProductImageService
  uploadProductImage(productId: number, productName: string) {
    const token = localStorage.getItem('token');

    console.log('🔐 TOKEN PARA SUBIR IMAGEN:', token);

    if (!token) {
      console.error('❌ NO hay token JWT');
      this.errorMessage = 'Sesión expirada. Vuelve a iniciar sesión.';
      this.loading = false;
      return;
    }

    this.productImageService
      .uploadImage(productId, this.selectedFile!, true, token)
      .subscribe({
        next: () => {
          this.selectedFile = null;
          this.finishSuccess(productName);
        },
        error: (err) => {
          console.error('❌ Error al subir imagen:', err);
          this.loading = false;
          this.errorMessage =
            'Producto creado, pero error al subir la imagen';
        }
      });
  }

  // ✅ Finalizar correctamente
  finishSuccess(productName: string) {
    this.loading = false;

    this.saveActivity('add', productName);

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
  }

  // 🟦 Log de actividad
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
