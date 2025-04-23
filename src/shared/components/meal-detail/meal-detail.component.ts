import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { catchError } from "rxjs";
import { Meal } from "../../../core/models/meal.type";
import { MealService } from "../../../core/services/meal.service";
import { YouTubePlayerModule } from "@angular/youtube-player";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-meal-detail',
  templateUrl: './meal-detail.component.html',
  styleUrls: ['./meal-detail.component.css'],
  standalone: true,
  imports: [RouterLink, YouTubePlayerModule, CommonModule]
})
export class MealDetailComponent implements OnInit {
  router = inject(Router);
  isLoading = signal<boolean>(false);
  isLoadingSuggestion = signal<boolean>(false);
  route = inject(ActivatedRoute);
  mealData = signal<Meal | null>(null);
  suggestionMeals = signal<Meal[]>([]);
  id = signal<string>('');
  youtubeVideoId = signal<string>('');
  apiLoaded = signal<boolean>(false);

  constructor(private mealService: MealService) { }

  ngOnInit() {
    // Load YouTube API script
    if (!this.apiLoaded()) {
      // This code loads the IFrame Player API code asynchronously
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded.set(true);
    }

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.id.set(id);
      this.isLoading.set(true);

      this.mealService.getMealDetails(id)
        .pipe(
          catchError((error) => {
            console.error('Error fetching meal details:', error);
            this.isLoading.set(false);
            return [];
          }))
        .subscribe({
          next: (data) => {
            // First check if data.meals is a string (error case)
            if (typeof data.meals === 'string') {
              console.error('API returned error:', data.meals);
              this.mealData.set(null);
            }
            // Now check if it's a valid array with content
            else if (data && data.meals && Array.isArray(data.meals) && data.meals.length > 0) {
              this.mealData.set(data.meals[0]);

              // Extract YouTube video ID if available
              if (this.mealData()?.strYoutube) {
                this.youtubeVideoId.set(this.getYoutubeVideoId(this.mealData()?.strYoutube || ''));
              }

              this.getSuggestionMealByMainIngredient();
            }
            else {
              // Handle no data case
              this.mealData.set(null);
            }

            this.isLoading.set(false);

          },
          error: () => {
            this.isLoading.set(false);
          }
        });

    }
  }

  // Extract YouTube video ID from URL
  getYoutubeVideoId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : '';
  }

  // Kiểm tra xem mealData có phải là đối tượng Meal hợp lệ không
  isMeal(): boolean {
    return this.mealData() !== null;
  }

  // Trả về mảng từ 1-20 để lặp qua danh sách nguyên liệu
  getIngredientIndexes(): number[] {
    return Array.from({ length: 20 }, (_, i) => i + 1);
  }

  // Lấy nguyên liệu theo index
  getIngredient(index: number): string | null {
    if (!this.isMeal()) return null;

    const meal = this.mealData() as Meal;
    const property = `strIngredient${index}` as keyof Meal;
    const ingredient = meal[property];

    // Trả về null nếu nguyên liệu là rỗng hoặc null
    if (!ingredient || ingredient === '') return null;

    return ingredient as string;
  }

  // Lấy số lượng theo index
  getMeasure(index: number): string | null {
    if (!this.isMeal()) return null;

    const meal = this.mealData() as Meal;
    const property = `strMeasure${index}` as keyof Meal;
    const measure = meal[property];

    // Trả về null nếu số lượng là rỗng hoặc null
    if (!measure || measure === '') return null;

    return measure as string;
  }

  getSuggestionMealByMainIngredient() {
    if (this.mealData() && this.mealData()?.strIngredient1) {
      this.isLoadingSuggestion.set(true);
      const mainIngredient = this.mealData()?.strIngredient1;
      this.mealService.getMealsByMainIngredient(mainIngredient || '')
        .pipe(
          catchError((error) => {
            console.error('Error fetching meals by ingredient:', error);
            return [];
          }))
        .subscribe({
          next: (data) => {
            console.log("data", data);
            // First check if data.meals is a string (error case)
            if (typeof data.meals === 'string') {
              console.error('API returned error:', data.meals);
              this.suggestionMeals.set([]);
            }
            // Now check if it's a valid array with content
            else if (data && data.meals && Array.isArray(data.meals) && data.meals.length > 0) {
              this.suggestionMeals.set(data.meals.slice(0, 4)); // Get first 6 meals
              this.isLoadingSuggestion.set(false);
            } else {
              // Handle no data case
              this.suggestionMeals.set([]);
              this.isLoadingSuggestion.set(false);
            }
          },
          error: () => {
            console.error('Error fetching meals by ingredient');
            this.isLoadingSuggestion.set(false);
          }
        });
    } else {
      console.error('No main ingredient found in meal data');
      this.isLoadingSuggestion.set(false);
    }
  }
}
