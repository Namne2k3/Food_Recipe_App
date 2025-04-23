import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MealService } from "../../../core/services/meal.service";
import { CategoriesResponse, Category } from "../../../core/models/category.type";
import { CommonModule } from "@angular/common";
import { MealSummary } from "../../../core/models/meal.type";
import { catchError } from "rxjs";
import { NgxPaginationModule } from 'ngx-pagination'; // Import the NgxPaginationModule

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  imports: [CommonModule, RouterLink, NgxPaginationModule]
})

export class CategoriesComponent implements OnInit {
  router = inject(Router)
  route = inject(ActivatedRoute)
  mealService = inject(MealService)
  categoriesData = signal<Category[]>([])
  mealsDataByCategory = signal<MealSummary[]>([])
  isLoadingMealsByCategory = signal<boolean>(false)
  selectedCategory = signal<string | null>(null)

  currentPage = signal<number>(1)
  itemsPerPage = signal<number>(6)

  ngOnInit() {
    this.mealService.getCategories().subscribe((data: CategoriesResponse) => {
      this.categoriesData.set(data.categories);
    });

    this.route.params.subscribe(params => {
      let categoryName = params['categoryName'];
      if (!categoryName) {
        categoryName = this.categoriesData()?.[0]?.strCategory || null;
      }

      if (categoryName) {
        this.selectedCategory.set(categoryName);
        this.isLoadingMealsByCategory.set(true);
        this.currentPage.set(1)

        this.mealService.getMealsByCategory(categoryName)
          .pipe(
            catchError((err) => {
              console.log('Error', err);
              this.isLoadingMealsByCategory.set(false);
              throw err;
            }))
          .subscribe({
            next: (data) => {
              this.isLoadingMealsByCategory.set(true);
              this.mealsDataByCategory.set(data.meals);
              this.isLoadingMealsByCategory.set(false);
            },
            error: (err) => {
              console.log('Error', err);
              this.isLoadingMealsByCategory.set(false);
            }
          })

      }
    });
  }

  onCategorySelect(category: string) {
    console.log(category);
    this.selectedCategory.set(category);
    this.router.navigate(['/categories', category]);
  }
}
