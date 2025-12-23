import { Routes } from '@angular/router';
import { ProductDescriptionComponent } from './pages/users_pages/product-description/product-description';  
import { CartComponent } from './pages/users_pages/cart/cart';
import { OrdersComponent } from './pages/users_pages/orders/orders';
export const routes: Routes = [
  {
    path: '',
    component: ProductDescriptionComponent
  }, {path: 'cart', component: CartComponent},
  {path: 'orders', component: OrdersComponent}
];
