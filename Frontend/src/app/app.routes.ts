import { Routes } from '@angular/router';

import { MainLayout } from '../layouts/main-layout/main-layout';

import { Inicio } from './pages/admin_pages/inicio/inicio';
import { AddProduct } from './pages/admin_pages/add-product/add-product';
import { Inventory } from './pages/admin_pages/inventory/inventory';
import { Reports } from './pages/admin_pages/reports/reports';
import { Users } from './pages/admin_pages/users/users';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'inicio',
        component: Inicio
      },
      {
        path: 'add_product',
        component: AddProduct
      },
      {
        path: 'inventory',
        component: Inventory
      },
      {
        path: 'reports',
        component: Reports
      },
      {
        path: 'users',
        component: Users
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  }
];
