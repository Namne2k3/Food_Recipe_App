import { Component, inject, OnDestroy, OnInit, signal, } from '@angular/core';
import { Meal } from '../../../core/models/meal.type';
import { RouterLink, Router } from '@angular/router';
import { Category } from '../../../core/models/category.type';
import { MealService } from '../../../core/services/meal.service';
import { catchError, finalize, forkJoin, of, shareReplay, Subject, takeUntil } from 'rxjs';
import { CategoryCardComponent } from '../category-card/category-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CategoryCardComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

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
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  private destroy$ = new Subject<void>();
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

      forkJoin({
        randomMeal: this.mealService.getRandomMeal(),
        /*
          Sau khi gọi hàm getRandomMeal, chúng ta sẽ gọi hàm getCategories
          để lấy danh sách các loại món ăn
        */
        categories: this.mealService.getCategories()
      })
        .pipe(
          shareReplay(1), // Chia sẻ kết quả giữa các subscriber , cache lại kết quả
          catchError((err) => {
            console.error('Lỗi khi tải dữ liệu:', err);
            this.error.set('Không thể tải dữ liệu, vui lòng thử lại sau.');
            return of({ randomMeal: null, categories: [] }); // Trả về giá trị mặc định nếu có lỗi
          }),
          takeUntil(this.destroy$), // Hủy đăng ký khi component bị hủy
          finalize(() => this.isLoading.set(false))
        )
        .subscribe(this.processInitialData.bind(this));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // tách việc bind dữ liệu sau khi gọi api ra một hàm riêng
  private processInitialData({ randomMeal, categories }: {
    randomMeal: { meals?: Meal[] } | null,
    categories: { categories: Category[] } | never[]
  }): void {
    if (randomMeal?.meals?.[0]) {
      this.randomMeal.set(randomMeal.meals[0]);
    }
    if (categories && 'categories' in categories) {
      this.categories.set(categories.categories);
    }
  }

  handleSearch() {
    this.router.navigate(['/meals'], { queryParams: { search: this.searchTerm() } });
  }

  handleNavigateToMealsPage() {
    this.router.navigate(['/meals'])
  }
}
