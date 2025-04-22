import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MealService } from "../../../core/services/meal.service";
import { Meal } from "../../../core/models/meal.type";
import { catchError, debounceTime, distinctUntilChanged, Subject, takeUntil } from "rxjs";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

/*
  Note về RxJS:
  - subscribe: Đăng ký để nhận dữ liệu từ Observable. Khi có dữ liệu mới, hàm callback sẽ được gọi.
  - pipe: Làm việc với các toán tử RxJS để xử lý dữ liệu trước khi nó được gửi đến subscribe.
  - catchError: Bắt lỗi trong quá trình xử lý dữ liệu. Nếu có lỗi, nó sẽ trả về một Observable mới với giá trị mặc định hoặc thông báo lỗi.

  nó là một thư viện giúp quản lý luồng dữ liệu bất đồng bộ
  (như sự kiện, HTTP, input người dùng...) một cách hiệu quả,
  đặc biệt phù hợp với Angular vì Angular sử dụng RxJS rất nhiều trong hệ sinh thái của nó
  (như HttpClient, ReactiveForms, EventEmitter, v.v).
*/


@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  imports: [FormsModule, RouterLink, CommonModule],
})
export class MealsComponent implements OnInit, OnDestroy {

  searchTerm = signal<string>('')
  isLoading = signal<boolean>(false)
  mealsData = signal<Meal[]>([])
  route = inject(ActivatedRoute)
  router = inject(Router)
  mealService = inject(MealService)

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  ngOnInit(): void {

    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$) // để hủy đăng ký khi component bị hủy
    ).subscribe((term) => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: term || null },
        queryParamsHandling: 'merge'
      })
      this.searchMeals();
    })


    /*
      có thể dùng cách này trong lần đầu tiên
      this.searchTerm = this.route.snapshot.queryParams['search'] || '';

      đăng ký sự kiện theo dõi
    */
    this.route.queryParams.subscribe(params => {
      this.searchTerm.set(params['search'] || '');
      // console.log('Search term from query params:', this.searchTerm());
      this.searchMeals();
    });
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;

    this.searchTerm.set(input.value.trim());
    this.searchSubject.next(input.value.trim());
  }

  searchMeals() {

    this.isLoading.set(true);
    this.mealService.searchMeals(this.searchTerm())
      .pipe(
        catchError((err) => {
          console.log('Error', err);
          this.isLoading.set(false);
          throw err;
        }))
      .subscribe({
        next: (data) => {
          this.mealsData.set(data.meals || []);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }

  clearSearch() {
    this.searchTerm.set('');
    this.searchSubject.next('');
  }

  ngOnDestroy(): void {
    // Dọn dẹp subscriptions để tránh memory leak
    this.destroy$.next();
    this.destroy$.complete();
  }

}
