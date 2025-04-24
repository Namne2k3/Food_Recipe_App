import { Component, inject, OnInit, signal } from '@angular/core';
import { Meal } from '../../../core/models/meal.type';
import { RouterLink, Router } from '@angular/router';
import { Category } from '../../../core/models/category.type';
import { MealService } from '../../../core/services/meal.service';
import { catchError } from 'rxjs';
import { CategoryCardComponent } from '../category-card/category-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CategoryCardComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  // Sử dụng signal để lưu trữ dữ liệu
  // signal là một tính năng mới trong Angular giúp quản lý trạng thái dễ dàng hơn

  // Tại sao lại nên sử dụng signal thay vì khai báo biến thông thường?
  // Vì khi sử dụng signal, Angular biết chính xác khi nào và cái gì thay đổi, nên có thể cập nhật
  // UI một cách tự động, chính xác và tối ưu hơn

  randomMeal = signal<Meal | null>(null)
  categories = signal<Category[]>([])
  searchTerm = signal<string>('')
  mealService = inject(MealService)
  router = inject(Router)

  constructor() {

  }


  ngOnInit(): void {
    // Trang chủ khi init sẽ sử dụng mealService đã được inject để gọi hàm getRandomMeal
    // và hàm này sẽ trả về một Observable, vì vậy chúng ta sẽ sử dụng subscribe để nhận dữ liệu

    // Observable là gì?
    // Observable là một "luồng dữ liệu" mà ta có thể đăng ký  (subscribe) để nhận dữ liệu
    // khi nó xuất hiện
    // Đặc biệt nó là một lazy, nghĩa là nó sẽ không thực thi cho đến khi có người đăng ký (subscribe)
    if (this.mealService) {
      this.mealService.getRandomMeal()
        .pipe(
          catchError((err) => {
            console.log('Error', err);
            throw err;
          })
        )
        .subscribe((data) => {
          // Khi bạn set lại giá trị...
          this.randomMeal.set(data.meals[0]); // => UI sẽ tự cập nhật!
        });


      // Sau khi gọi hàm getRandomMeal, chúng ta sẽ gọi hàm getCategories
      // để lấy danh sách các loại món ăn
      this.mealService.getCategories()
        .pipe(
          catchError((err) => {
            console.log('Error', err);
            throw err;
          })
        )
        .subscribe((data) => {
          this.categories.set(data.categories);
        });
    }
  }

  handleSearch() {
    this.router.navigate(['/meals'], { queryParams: { search: this.searchTerm() } });
  }

  handleNavigateToMealsPage() {
    this.router.navigate(['/meals'])
  }
}
