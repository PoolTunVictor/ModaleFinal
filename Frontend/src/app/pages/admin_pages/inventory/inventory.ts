import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../../core/service/product.service';
import { Product } from '../../../core/interface/product';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class Inventory implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];

  loading = false;
  errorMessage = '';
  searchTerm = '';

  // Modales
  showDeleteModal = false;
  showEditModal = false;
  productToDelete: Product | null = null;
  productToEdit: Product | null = null;
  selectedCategory = 'all';

  // Categorías (temporal)
  categoriesMap: Record<number, string> = {
    1: 'Maquillaje',
    2: 'Perfumes',
    3: 'Prendas',
    4: 'Cuidado facial',
    5: 'Cuidado corporal',
    6: 'Accesorios'
  };

  constructor(
    private productService: ProductService,
    private router:Router
  ) {}

  ngOnInit(): void {
    const navigation = history.state;
    this.loadProducts(navigation?.updatedProduct);
  }

  loadProducts(updatedProduct?: Product): void {
    this.loading = true;

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;

        // 🔥 REEMPLAZAR SIN CAMBIAR EL ORDEN
        if (updatedProduct) {
          const index = this.products.findIndex(
            p => p.id === updatedProduct.id
          );

          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
        }

        this.filteredProducts = [...this.products];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // 🔍 Buscar
  filterProducts(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredProducts = this.products.filter(product => {

      // 🔍 Filtro por nombre o slug
      const matchesText =
        !term ||
        product.name.toLowerCase().startsWith(term) ||
        product.slug.toLowerCase().startsWith(term);

      // 🏷️ Filtro por categoría
      const matchesCategory =
        this.selectedCategory === 'all' ||
        product.category_id === Number(this.selectedCategory);

      return matchesText && matchesCategory;
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.filteredProducts = this.products;
  }


  getCategoryName(categoryId: number): string {
    return this.categoriesMap[categoryId] || 'Sin categoría';
  }

  // 🗑️ Modal eliminar
  openDeleteModal(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  confirmDelete(): void {
    if (!this.productToDelete) return;

    this.productService.deleteProduct(this.productToDelete.id!).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== this.productToDelete!.id);
        this.filteredProducts = this.filteredProducts.filter(p => p.id !== this.productToDelete!.id);
        this.closeDeleteModal();
      }
    });
  }

  // ✏️ Modal editar (preview)
  openEditModal(product: Product): void {
    this.router.navigate(['/admin/edit-product', product.id]);
  }


  closeEditModal(): void {
    this.showEditModal = false;
    this.productToEdit = null;
  }
}
