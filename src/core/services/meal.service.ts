import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meal, MealsResponse, MealSummary } from '../models/meal.type';
import { Category, CategoriesResponse } from '../models/category.type';

function parseString(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '') // loại bỏ ký tự đặc biệt
    .replace(/\s+/g, '_');
}

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1';
  http = inject(HttpClient);
  constructor() { }

  // Tìm kiếm món ăn theo tên
  searchMeals(term: string): Observable<MealsResponse> {
    return this.http.get<MealsResponse>(`${this.apiUrl}/search.php?s=${parseString(encodeURIComponent(term))}`);
  }

  getMealsByMainIngredient(ingredient: string): Observable<MealsResponse> {
    return this.http.get<MealsResponse>(`${this.apiUrl}/filter.php?i=${encodeURIComponent(ingredient)}`);
  }

  // Lấy chi tiết món ăn theo ID
  getMealDetails(id: string): Observable<MealsResponse> {
    return this.http.get<MealsResponse>(`${this.apiUrl}/lookup.php?i=${encodeURIComponent(id)}`);
  }

  // Lấy món ăn ngẫu nhiên
  getRandomMeal(): Observable<MealsResponse> {
    return this.http.get<MealsResponse>(`${this.apiUrl}/random.php`);
  }

  // Lấy danh sách các danh mục
  getCategories(): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(`${this.apiUrl}/categories.php`);
  }

  // Lấy danh sách món ăn theo danh mục
  getMealsByCategory(category: string): Observable<{ meals: MealSummary[] }> {
    return this.http.get<{ meals: MealSummary[] }>(`${this.apiUrl}/filter.php?c=${encodeURIComponent(category)}`);
  }
}
