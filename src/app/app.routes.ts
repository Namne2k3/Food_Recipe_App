import { Routes } from '@angular/router';
import { MealsComponent } from './shared/components/meals/meals.component';
import { MealDetailComponent } from './shared/components/meal-detail/meal-detail.component';
import { CategoriesComponent } from './shared/components/category/categories.component';
import { ContactComponent } from './shared/components/contact/contact.component';

export const routes: Routes = [
  // mặc định route
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./shared/components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'categories',
    pathMatch: 'full',
    loadComponent: () => import('./shared/components/category/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: 'meals',
    component: MealsComponent
  },
  { path: 'meal/:id', component: MealDetailComponent },
  { path: 'categories/:categoryName', component: CategoriesComponent },
  { path: 'contact', component: ContactComponent },
];
