# Food Recipe Web

Ứng dụng web tra cứu công thức món ăn được xây dựng với Angular và TheMealDB API. Dự án này được phát triển như một ứng dụng client-side đơn giản để thực hành các khái niệm cơ bản của Angular.

## Tổng quan

Food Recipe Web là một ứng dụng cho phép người dùng:
- Tìm kiếm công thức món ăn
- Xem danh sách món ăn theo danh mục
- Xem chi tiết công thức và hướng dẫn nấu ăn
- Khám phá món ăn ngẫu nhiên

## Chức năng chính

1. **Trang chủ**
   - Hiển thị danh mục món ăn phổ biến
   - Hiển thị món ăn đề xuất
   - Hiển thị một món ăn ngẫu nhiên
   - Thanh tìm kiếm nhanh

2. **Tìm kiếm món ăn**
   - Tìm kiếm theo tên món ăn
   - Lọc kết quả tìm kiếm
   - Hiển thị kết quả dưới dạng grid

3. **Xem danh mục món ăn**
   - Hiển thị danh sách các món ăn theo danh mục
   - Phân trang kết quả (nếu cần)

4. **Xem chi tiết món ăn**
   - Hiển thị hình ảnh món ăn
   - Hiển thị danh sách nguyên liệu và định lượng
   - Hiển thị hướng dẫn nấu ăn theo từng bước
   - Hiển thị video hướng dẫn (nếu có)
   - Hiển thị thông tin bổ sung (quốc gia xuất xứ, thẻ)

5. **Món ăn ngẫu nhiên**
   - Hiển thị một món ăn ngẫu nhiên
   - Tùy chọn để lấy món ăn ngẫu nhiên khác

## Công nghệ sử dụng

- **Frontend**: Angular 17+
- **API**: TheMealDB (https://www.themealdb.com/api.php)
- **UI Components**: Angular Material (tùy chọn)
- **CSS**: SCSS

## Kiến thức Angular được áp dụng

- Components và Templates
- Data binding (property binding, event binding, two-way binding)
- Content Projection (ng-content)
- Directives (ngIf, ngFor, custom directives)
- Services và Dependency Injection
- HTTP Client và Observables
- Routing
- Forms (Reactive Forms)
- Pipes (built-in và custom pipes)

## Cấu trúc dự án

```
food-recipe-web/
├── src/
│   ├── app/
│   │   ├── core/           # Services, models, guards
│   │   ├── features/       # Feature components (home, recipe-detail, etc.)
│   │   ├── shared/         # Shared components, directives, pipes
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── assets/
│   ├── environments/
│   └── index.html
└── ...
```

## Hướng dẫn cài đặt

1. Clone repository
2. Cài đặt dependencies: `npm install`
3. Chạy ứng dụng: `ng serve`
4. Truy cập ứng dụng tại: `http://localhost:4200`