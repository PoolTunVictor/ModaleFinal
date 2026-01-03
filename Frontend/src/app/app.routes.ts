import { Routes } from '@angular/router';

// ========== AUTH ==========
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// ========== USER PAGES ==========
import { HomeComponent } from './pages/users_pages/home/home';
import { CategoriesComponent } from './pages/users_pages/categories/categories';
import { CategoryDetailComponent } from './pages/users_pages/category-detail/category-detail';
import { ProductDescriptionComponent } from './pages/users_pages/product-description/product-description';
import { CartComponent } from './pages/users_pages/cart/cart';
import { OrdersComponent } from './pages/users_pages/orders/orders';
import { AccountSummaryComponent } from './pages/users_pages/user_resume/account-summary.component';
import { MiPerfilComponent } from './pages/users_pages/user_perfil/mi-perfil.component';

// ========== ADMIN LAYOUT ==========
import { MainLayout } from '../layouts/main-layout/main-layout';

// ========== ADMIN PAGES ==========
import { Inicio } from './pages/admin_pages/inicio/inicio';
import { AddProduct } from './pages/admin_pages/add-product/add-product';
import { Inventory } from './pages/admin_pages/inventory/inventory';
import { Reports } from './pages/admin_pages/reports/reports';
import { Users } from './pages/admin_pages/users/users';
import { EditProduct } from './pages/admin_pages/edit-product/edit-product';


export const routes: Routes = [

  // 🔓 LANDING
  { path: '', component: HomeComponent },

  // 🔐 AUTH
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 👤 USER
  { path: 'home', component: HomeComponent },
  { path: 'categorias', component: CategoriesComponent },
  { path: 'categorias/:nombre', component: CategoryDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'resume', component: AccountSummaryComponent },
  { path: 'perfil', component: MiPerfilComponent },

  // 🛠️ ADMIN (CON LAYOUT)
  {
    path: 'admin',
    component: MainLayout,
    children: [
      { path: 'inicio', component: Inicio },
      { path: 'add_product', component: AddProduct },
      { path: 'inventory', component: Inventory },
      { path: 'edit-product/:id', component: EditProduct },
      { path: 'reports', component: Reports },
      { path: 'users', component: Users },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  },

  // 🚨 WILDCARD
  { path: '**', redirectTo: '' }
];
