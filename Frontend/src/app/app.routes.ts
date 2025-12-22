import { Routes } from '@angular/router';
import { CategoriesComponent } from './pages/users_pages/categories/categories';
import { HomeComponent } from './pages/users_pages/home/home';
import { CategoryDetailComponent } from './pages/users_pages/category-detail/category-detail';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'categorias', component: CategoriesComponent },
  { path: 'categorias/:nombre', component: CategoryDetailComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' } // Redirección por defecto
];


    