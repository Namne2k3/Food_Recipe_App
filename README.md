## Phiên bản

### Phiên bản hiện tại: v1.0.3

### Các thay đổi trong phiên bản v1.0.3
- Cập nhật thêm trang Contact sử dụng Reactive Form Module


# Food Recipe Web

Food Recipe Web là ứng dụng web hiện đại được phát triển bằng Angular 19, cho phép người dùng khám phá, tìm kiếm và xem các công thức nấu ăn đa dạng từ khắp nơi trên thế giới. Ứng dụng này sử dụng TheMealDB API để cung cấp dữ liệu về các món ăn.

## Tính năng chính

### 1. Trang chủ
- Giới thiệu tổng quan về ứng dụng
- Hiển thị các danh mục món ăn phổ biến
- Giao diện trực quan và thân thiện với người dùng

### 2. Tìm kiếm món ăn
- Tìm kiếm món ăn theo tên
- Hiển thị kết quả tìm kiếm với phân trang
- Lưu trữ từ khóa tìm kiếm trong URL để dễ dàng chia sẻ hoặc bookmark

### 3. Danh mục món ăn
- Hiển thị tất cả danh mục món ăn với sidebar bên trái
- Lựa chọn danh mục bằng radio button
- Xem các món ăn theo danh mục được chọn
- Phân trang kết quả món ăn trong danh mục
- Lưu trữ trạng thái phân trang trong URL

### 4. Chi tiết món ăn
- Xem công thức chi tiết của món ăn
- Hiển thị hình ảnh, nguyên liệu và hướng dẫn nấu ăn
- Liên kết đến video hướng dẫn (nếu có)

### 5. Tính năng UI/UX
- Thiết kế đáp ứng (responsive) trên mọi thiết bị
- Hiệu ứng loading khi tải dữ liệu
- Thông báo khi không tìm thấy kết quả
- Phân trang để dễ dàng điều hướng qua các kết quả

## Minh họa giao diện

Dự án bao gồm các hình ảnh minh họa cho các trang chính trong thư mục `src/assets/images/`:

| Trang | Mô tả |
|-------|--------|
| ![Trang chủ 1](/src/assets/images/trang_chu_1.png) | Giao diện trang chủ (phần 1) |
| ![Trang chủ 2](/src/assets/images/trang_chu_2.png) | Giao diện trang chủ (phần 2) |
| ![Trang danh mục](/src/assets/images/trang_danh_muc.png) | Trang hiển thị danh mục món ăn với sidebar |
| ![Trang món ăn](/src/assets/images/trang_mon_an.png) | Trang tìm kiếm và hiển thị món ăn |
| ![Trang chi tiết món ăn 1](/src/assets/images/trang_chi_tiet_mon_an_1.png) | Chi tiết món ăn (phần 1) |
| ![Trang chi tiết món ăn 2](/src/assets/images/trang_chi_tieti_mon_an_2.png) | Chi tiết món ăn (phần 2) |

## Công nghệ sử dụng
- **Angular 19.2.0: Framework frontend chính
- **Angular Signals**: Quản lý trạng thái ứng dụng
- **Bootstrap 5**: Framework CSS cho giao diện đáp ứng
- **RxJS**: Xử lý luồng dữ liệu bất đồng bộ
- **NgRx Pagination**: Phân trang dữ liệu
- **TheMealDB API**: Nguồn dữ liệu công thức nấu ăn

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng mở issue hoặc gửi pull request nếu bạn muốn cải thiện ứng dụng.

## Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.
