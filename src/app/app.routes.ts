import { Routes } from '@angular/router';
import { MealsComponent } from '../shared/components/meals/meals.component';

export const routes: Routes = [
  // mặc định route
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('../shared/components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'categories',
    pathMatch: 'full',
    loadComponent: () => import('../shared/components/category/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: 'meals',
    component: MealsComponent
  }
];
