import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxPaginationModule } from 'ngx-pagination'; // Import the NgxPaginationModule
import { catchError } from "rxjs";
import { CategoriesResponse, Category } from "../../../core/models/category.type";
import { MealSummary } from "../../../core/models/meal.type";
import { MealService } from "../../../core/services/meal.service";
import { MealSummaryCard } from "../meal-summary-card/meal-summary-card.component";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  imports: [CommonModule, NgxPaginationModule, MealSummaryCard]
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

  /*
    Khi component được hiển thị
    sẽ dùng mealService đã được inject để gọi các hàm để lấy dữ liệu
    (getCategories, getMealsByCategory)
  */
  ngOnInit() {


    /*
      Khi component được khởi tạo, sẽ gọi hàm getCategories() để lấy danh sách các category
      và lưu vào biến categoriesData
    */
    this.mealService.getCategories().subscribe((data: CategoriesResponse) => {
      this.categoriesData.set(data.categories);
    });

    /*
      Đăng ký lắng nghe sự kiện khi categoryName thay đổi trên url
      cập nhật lại selectedCategory và gọi hàm getMealsByCategory()
      để lấy danh sách các món ăn theo category
    */
    this.route.params.subscribe(params => {
      let categoryName = params['categoryName'];

      // không có params khi vào trang categories mặc định
      // nếu không có categoryName tức là đang ở trang mặc định của categories
      // nếu không có categoryName thì sẽ lấy category đầu tiên trong danh sách categories
      if (!categoryName) {
        categoryName = this.categoriesData()?.[0]?.strCategory || null;
      }


      /*
        nếu có categoryName thì sẽ gọi hàm getMealsByCategory()
        để lấy danh sách các món ăn theo category
        và lưu vào biến mealsDataByCategory
      */
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
              this.mealsDataByCategory.set(data.meals); // Lưu danh sách món ăn vào biến mealsDataByCategory
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
    this.selectedCategory.set(category);

    /*
      hàm router.navigate này chuyển hướng đến trang categories với tham số categoryName là category
      tức là có sự thay đỏi trong query params của url
      và route.params sẽ tự động bắt sự kiện này trong ngOnInit vì ta đã đăng ký lắng nghe sự kiện này
      trong hàm ngOnInit
    */
    this.router.navigate(['/categories', category]);
  }
}
