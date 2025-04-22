import { Component, inject, OnInit, signal } from '@angular/core';
import { Meal } from '../../../core/models/meal.type';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models/category.type';
import { MealService } from '../../../core/services/meal.service';
import { catchError } from 'rxjs';
import { CategoryCardComponent } from '../category-card/category-card.component';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CategoryCardComponent, SlicePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  randomMeal = signal<Meal | null>(null)
  categories = signal<Category[]>([])
  mealService = inject(MealService)

  constructor() {

  }
  ngOnInit(): void {
    if (this.mealService) {
      this.mealService.getRandomMeal()
        .pipe(
          catchError((err) => {
            console.log('Error', err);
            throw err;
          })
        )
        .subscribe((data) => {
          this.randomMeal.set(data.meals[0]);
        });
    }
  }


}
