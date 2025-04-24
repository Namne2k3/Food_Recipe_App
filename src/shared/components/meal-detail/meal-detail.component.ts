import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { catchError } from "rxjs";
import { Meal } from "../../../core/models/meal.type";
import { MealService } from "../../../core/services/meal.service";
import { YouTubePlayerModule } from "@angular/youtube-player"; // khai báo module youtube player
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

  youtubeVideoId = signal<string>(''); // tạo biến lưu id video youtube
  apiLoaded = signal<boolean>(false); // biến kiểm tra api đã load hay chưa

  /*
    khai báo signal để lưu trạng thái tab hiện tại
    Mặc định hiển thị tab "ingredients"
  */
  activeTab = signal<string>('ingredients');

  /*
    Định nghĩa phương thức chuyển tab
    để chuyển dổi giữa các tab
  */
  setActiveTab(tabId: string): void {
    this.activeTab.set(tabId);
  }

  /*
    inject mealService thông qua constructor
    để sử dụng các phương thức của mealService

    có thể sử dụng inject() để inject service
  */
  constructor(private mealService: MealService) { }

  ngOnInit() {
    /*
      - Mục đích của đoạn code này là để tải mã API của YouTube IFrame Player
      khi component được khởi tại
      - Nếu đang dùng thư viện <youtube-player> trong Angular
      thì Youtube Iframe API cần được tải trước để component hoạt động được
      -> Đảm bảo rằng mã API chỉ được tải một lần duy nhất
      -> Không bị load lại nhiều lần mỗi khi component được tạo lại

      ?Vì sao cần YouTube API?
      - Để tải video
      - Điều khiển video (play, pause, chất lượng, v.v)
      - Giúp giao tiếp với player từ code
      - Nếu không tải trước script này, player sẽ không hoạt động hoặc lỗi YT is not defined
    */
    if (!this.apiLoaded()) {
      // This code loads the IFrame Player API code asynchronously
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
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

            /*
              Do dữ liệu không hợp lệ của theMealDB sẽ trả về data.meals = "Invalid ID"
              Nên cần kiểm tra xem data.meals có phải là một chuỗi hay không
              Nếu đúng thì sẽ không phải là một mảng chứa các món ăn
            */
            if (typeof data.meals === 'string') {
              console.error('API returned error:', data.meals);
              this.mealData.set(null);
            }

            // nếu nó không phải là một chuỗi thì sẽ kiểm tra xem nó có phải là một mảng hay không
            // vì dữ liệu trả về chi tiết mealData là một phần tử duy nhất nằm trong mảng
            // nên ta sẽ phải lấy ra phần tử đầu tiên của mảng
            else if (data && data.meals && Array.isArray(data.meals) && data.meals.length > 0) {
              this.mealData.set(data.meals[0]);

              if (this.mealData()?.strYoutube) {
                this.youtubeVideoId.set(this.getYoutubeVideoId(this.mealData()?.strYoutube || ''));
              }
              /*
                chỉ gọi hàm này khi mealData đã có dữ liệu (!== null)
                vì hàm này tìm kiếm những món ăn liên quan đến main ingredient của mealData
              */
              this.getSuggestionMealByMainIngredient();
            }
            else {
              this.mealData.set(null);
            }
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Error fetching meals by ingredient', err);
            this.isLoading.set(false);
          }
        });

    }
  }


  getYoutubeVideoId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : '';
  }

  // Kiểm tra xem mealData có phải là đối tượng Meal hợp lệ không
  isMeal(): boolean {
    return this.mealData() !== null;
  }

  /*
    Trả về mảng từ 1-20 để lặp qua danh sách nguyên liệu
    DO mặc định hàm này trả về 20 phần tử mặc định từng phần tử là undefined
    vì vậy truyền callback để xử lý phần dữ liệu này
    => thay vì trả về một mảng chứa 20 phần tử undefined thì
      ta sẽ trả về các con số index + 1
    Kết quả: [1,2,3, ... , 20]
  */
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
            if (typeof data.meals === 'string') {
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
