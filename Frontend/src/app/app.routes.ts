import { Routes } from '@angular/router';

// ================= USER PAGES =================
import { HomeComponent } from './pages/users_pages/home/home';
import { CategoriesComponent } from './pages/users_pages/categories/categories';
import { CategoryDetailComponent } from './pages/users_pages/category-detail/category-detail';
import { ProductDescriptionComponent } from './pages/users_pages/product-description/product-description';
import { CartComponent } from './pages/users_pages/cart/cart';
import { OrdersComponent } from './pages/users_pages/orders/orders';

// ================= ADMIN LAYOUT =================
import { MainLayout } from '../layouts/main-layout/main-layout';

// ================= ADMIN PAGES =================
import { Inicio } from './pages/admin_pages/inicio/inicio';
import { AddProduct } from './pages/admin_pages/add-product/add-product';
import { Inventory } from './pages/admin_pages/inventory/inventory';
import { Reports } from './pages/admin_pages/reports/reports';
import { Users } from './pages/admin_pages/users/users';

export const routes: Routes = [

  // 🔓 RUTAS DE USUARIO
  { path: '', component: ProductDescriptionComponent },   // landing
  { path: 'home', component: HomeComponent },
  { path: 'categorias', component: CategoriesComponent },
  { path: 'categorias/:nombre', component: CategoryDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersComponent },

  // 🔐 RUTAS ADMIN (CON LAYOUT)
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'inicio', component: Inicio },
      { path: 'add_product', component: AddProduct },
      { path: 'inventory', component: Inventory },
      { path: 'reports', component: Reports },
      { path: 'users', component: Users },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  },

  // 🔁 RUTA COMODÍN
  { path: '**', redirectTo: '' }
];
