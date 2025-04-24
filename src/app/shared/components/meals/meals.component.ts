import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, debounceTime, distinctUntilChanged, Subject, takeUntil } from "rxjs";
import { Meal } from "../../../core/models/meal.type";
import { MealService } from "../../../core/services/meal.service";
import { MealCardComponent } from "../meal-card/meal-card.component";
import { NgxPaginationModule } from 'ngx-pagination'; // Import the NgxPaginationModule
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
  imports: [FormsModule, CommonModule, MealCardComponent, NgxPaginationModule],
})
export class MealsComponent implements OnInit, OnDestroy {

  searchTerm = signal<string>('')
  isLoading = signal<boolean>(false)
  mealsData = signal<Meal[]>([])
  route = inject(ActivatedRoute)
  router = inject(Router)
  mealService = inject(MealService)

  currentPage = signal<number>(1)
  itemsPerPage = signal<number>(9)

  // Tạo một Subject để quản lý việc hủy đăng ký
  // Subject là một loại Observable có thể phát ra giá trị
  // và cũng có thể đăng ký để nhận giá trị từ các Observable khác

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  ngOnInit(): void {

    /*
      pipe là một toán tử (operator) RxJS cho phép bạn kết hợp nhiều toán tử lại với nhau
      để xử lý dữ liệu một cách tuần tự và dễ đọc hơn.
      Nó giống như một chuỗi các bước xử lý mà bạn muốn thực hiện trên dữ liệu trước khi nhận được nó trong subscribe.
      Ví dụ: bạn có thể sử dụng pipe để lọc, biến đổi, hoặc kết hợp nhiều Observable lại với nhau.
      các hàm như debounceTime hay distinctUntlChanged là các toán tử RxJS (Operator)

      hàm này sẽ được chạy khi searchSubject phát ra dựa vào hàm next()
      và giá trị mới (tín hiệu) từ hàm onSearchINput()
    */
    this.searchSubject
      .pipe(
        debounceTime(500), // đợi 500ms (nữa 1s) trước khi phát ra giá trị mới
        distinctUntilChanged(), // chỉ tiếp tục nếu giá trị mới khác với giá trị trước đó
        takeUntil(this.destroy$) // để hủy đăng ký khi component bị hủy
      )
      .subscribe((term) => { // ta đăng ký lắng nghe sự kiện khi searchSubject phát ra giá trị mới
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { search: term || null },
          queryParamsHandling: 'merge'
        })
        this.searchMeals();
      })


    /*
      => có thể dùng cách này để lấy giá trị từ queryParams
        nhưng không nên vì nó sẽ không tự động cập nhật khi queryParams thay đổi
        và cũng không thể sử dụng được với các toán tử RxJS
        như debounceTime hay distinctUntilChanged

        this.searchTerm = this.route.snapshot.queryParams['search'] || '';
        */

    /*
      vì route.queryParams là một Observable, nên ta cần subscribe để nhận giá trị
      ta đăng ký sự kiện thay đổi của params trong route
      và khi có sự thay đổi, ta sẽ cập nhật giá trị cho searchTerm
      và gọi hàm searchMeals để tìm kiếm món ăn theo từ khóa
    */
    this.route.queryParams.subscribe(params => {
      this.searchTerm.set(params['search'] || '');
      this.searchMeals(); // gọi hàm searchMeals để tìm kiếm món ăn theo từ khóa dựa vào searchTern ta đã set
    });
  }

  // binding dữ liệu của input search
  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value.trim());

    /*
      khi searchTern thay đổi thì ta sẽ phát ra giá trị mới cho searchSubject
      vì searchSubject là một Observable đặc biệt (Subject)
      nó sẽ phát ra giá trị mới, tín hiệu mới thông qua hàm next()
      và ta sẽ đăng ký lắng nghe sự kiện này trong hàm ngOnInit
    */
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

  /*
    destroy$ là một Subject, khi ta gọi next() trên nó,
    nó sẽ phát ra giá trị cho tất cả các subscriber

    - cụ thể là các Observable đã sử dụng operator takeUntil(this.destroy$)

    => Mục đích của việc destroy$ là để hủy đăng ký (unsubscribe) tất cả các Observable
    => Dọn dẹp subscriptions để tránh memory leak
  */

  ngOnDestroy(): void { // hàm này sẽ được gọi khi component bị hủy
    this.destroy$.next(); // hàm phát ra tín hiệu cho tất cả các subscriber
    this.destroy$.complete(); // hoàn thành Subject, không còn phát ra giá trị nào nữa
    this.searchSubject.complete(); // hoàn thành Subject, không còn phát ra giá trị nào nữa
  }

}
