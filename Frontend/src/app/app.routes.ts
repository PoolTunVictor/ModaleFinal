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


// ========== USER LAYOUT ==========
import { UserSide } from '../layouts/user_layout/user.layouts';
// ========== ADMIN LAYOUT ==========
import { MainLayout } from '../layouts/main-layout/main-layout';

// ========== ADMIN PAGES ==========
import { Inicio } from './pages/admin_pages/inicio/inicio';
import { AddProduct } from './pages/admin_pages/add-product/add-product';
import { Inventory } from './pages/admin_pages/inventory/inventory';
import { Reports } from './pages/admin_pages/reports/reports';
import { Users } from './pages/admin_pages/users/users';

export const routes: Routes = [

  // 🔓 LANDING
  { path: '', component: ProductDescriptionComponent },

  // 🔐 AUTH
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 👤 USER
  {
    path: '',
    component: UserSide,
    children: [
      { path: 'perfil', component: MiPerfilComponent },
      { path: 'resume', component: AccountSummaryComponent },
      { path: 'orders', component: OrdersComponent },
    ]
  },
  { path: 'home', component: HomeComponent },
  { path: 'categorias', component: CategoriesComponent },
  { path: 'categorias/:nombre', component: CategoryDetailComponent },
  { path: 'cart', component: CartComponent },
 
  
 

  // 🛠️ ADMIN (CON LAYOUT)
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

  // 🚨 WILDCARD
  { path: '**', redirectTo: '' }
];
