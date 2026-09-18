import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { sellerGuard } from './core/seller.guard';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AddProductComponent } from './pages/add-product/add-product.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Ozoon — маркетплейс' },
  { path: 'auth', component: AuthComponent, title: 'Вход' },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    title: 'Профиль',
  },
  {
    path: 'add-product',
    component: AddProductComponent,
    canActivate: [sellerGuard],
    title: 'Новый товар',
  },
  { path: '**', redirectTo: '' },
];
