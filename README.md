# CinemaManagement
 
# CM

Ứng dụng hỗ trợ quản lý rạp chiếu phim

## 1. Mô tả 

Đề tài này tập trung vào việc phát triển một hệ thống quản lý rạp chiếu phim hiệu quả. Hệ thống này sẽ cho phép người dùng 
tra cứu lịch chiếu phim, đặt vé, thanh toán online, xem thông tin phim, quản lý vé xem phim, đồng thời cũng ứng dụng cung cấp
các tính năng cho phép các công ty quản lý các rạp phim của mình từ xa, cung cấp thông tin báo cáo và thống kê. Mục tiêu là
tăng cường trải nghiệm của người dùng và làm cho việc quản lý các rạp phim trở nên dễ dàng và thuận tiện.


### 2. Mục đích, yêu cầu, người dùng hướng tới của đề tài

#### Mục đích

* Tăng cường trải nghiệm của người dùng: Hệ thống cung cấp công cụ tìm kiếm để người dùng dễ dàng tìm được bộ phim yêu thích nhờ đó đem lại một trải nghiệm tốt hơn cho người dùng.
* Tối ưu hoá quy trình bán vé: Hệ thống giúp cải thiện hiệu suất và hiệu quả của quy trình bán vé.
* Quản lý tài chính và tăng cường khả năng cạnh tranh: Hệ thống cung cấp công cụ quản lý tài chính mạnh mẽ, giúp theo dõi doanh thu, chi phí và lợi nhuận từ việc bán vé.
* Đảm bảo tính chính xác và tin cậy: Hệ thống đảm bảo tính chính xác và tin cậy trong việc ghi nhận, xử lý và lưu trữ thông tin.
* Tăng cường quản lý nội bộ: Hệ thống cung cấp công cụ quản lý thông tin người dùng và giao dịch, giúp nhân viên quản lý dễ dàng truy cập và xử lý thông tin

#### Yêu cầu

* UI/UX hợp lý, rõ ràng, thuận tiện cho người sử dụng.

* Đáp ứng đầy đủ những nghiệp vụ về quản lý rạp phim và quy trình bán vé

* Ứng dụng có những tính năng cơ bản. 

* Phân chia quyền hạn rõ ràng. 

#### Người dùng

* Quản lý rạp phim 

* Người muốn đặt vé xem phim

* Người muốn tra cứu phim

### 3. Tổng quan sản phẩm

#### 3.1 Chức năng
<details>
  <summary>Chức năng chung</summary>
 
- Đăng nhập
- Đăng xuất
- Quên mật khẩu
- Báo cáo lỗi
- Chỉnh sửa thông tin tài khoản

</details>

  ###### Manager (Quản lý)

  <details>
    <summary>Quản lý rạp phim</summary>

  - Thêm
  - Tìm kiếm
  - Sắp xếp
  - Xóa
  - Xem chi tiết
  - Sửa

  </details>

  <details>
    <summary>Quản lý phim</summary>
  - Thêm
  - Sắp xếp
  - Tìm kiếm
  - Xóa
  - Xem chi tiết
  - Sửa

  </details>

  <details>
    <summary>Quản lý nhân viên</summary>

  - Thêm
  - Tìm kiếm
  - Xóa
  - Xem chi tiết
  - Sửa

  </details>

  <details>
    <summary>Quản lý đồ ăn và thức uống</summary>

  - Tìm kiếm
  - Sắp xếp
  - Thêm
  - Xóa
  - Xem chi tiết
  - Sửa

  </details>

  <details>
    <summary>Quản lý lịch chiếu phim</summary>

  - Thêm
  - Xóa
  - Xem chi tiết
  - Sửa
  - Sắp xếp

  </details>

  <details>
    <summary>Thống kê doanh thu</summary>

   - Xem chi tiết

  </details>

  <details>
    <summary>Quản lý các tài khoản trong hệ thống</summary>

  - Tìm kiếm
  - Thêm
  - Xóa
  - Xem chi tiết
  - Sửa
  - Cấp quyền (Manager, Coach Assitant)

  </details>


  ###### User (Người dùng) 

  <details>
    <summary>Đăng ký tài khoản</summary>

  </details>

  <details>
    <summary>Tra cứu thông tin phim </summary>

  - Sắp xếp
  - Xem chi tiết

  </details>

  <details>
    <summary>Tra cứu lịch chiếu phim</summary>

  - Sắp xếp
  - Xem chi tiết

  </details>

  <details>
    <summary>Đặt vé xem phim</summary>

  - Xem lịch chiếu
  - Chọn ghế
  - Đặt thức ăn và nước uống
  - Thanh toán online

  </details>



#### 3.2 Công nghệ sử dụng

- Công cụ: Visual Studio Code, My SQL, Github Desktop, Firebase, Trello, Figma
- Ngôn ngữ lập trình: Java Script, TSQL, C#
- Thư viện: React Native, .Net Framework, Dapper

## 4. Hướng dẫn cài đặt
<details>
    <summary>Đối với người dùng</summary>

  * Dowload phần mềm Expo Go tại.
    * Google Play:  https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US
    * App Store: https://apps.apple.com/us/app/expo-go/id982107779
  * Scan QR code bằng Expo app tại: 
</details>

<details>
    <summary>Đối với nhà phát triển</summary>

  * Dowload, giải nén phần mềm
    * Github: https://github.com/tuonghuynh11/CinemaManagementApp
  * Cài đặt database
    * Khuyến nghị sử dụng các dịch vụ đám mây như Azure, AWS,… để sử dụng tất cả tính năng hiện có của chương trình  (server đi kèm với chương trình đã đóng).
  * Khởi tạo Database bằng cách chạy script chứa trong file Seed.sql
    * Tải file script tại: https://drive.google.com/file/d/16A-eas908EQ-AxfTJnNSVlXYHLRJXT82/view?usp=sharing
  * Kết nối với Database vừa tạo bằng cách thay đổi connectionStrings trong file App.config.
  * Đăng nhập với vai trò admin
      * tên đăng nhập: admin
      * mật khẩu: 12345

</details>

## 5. UI


<img src="https://github.com/user-attachments/assets/09128ef8-31d6-4c10-8a01-a9640f127658" width="250" height="590">
<img src="https://github.com/user-attachments/assets/cf653815-66ad-4dd0-a1b9-14cb93904c9c" width="250" height="590">
<img src="https://github.com/user-attachments/assets/9989daad-19f6-4a1b-9bd7-469cd0f0e5f4" width="250" height="590">
<img src="https://github.com/user-attachments/assets/31617cf7-dfcf-4491-ab37-ff8c78f27150" width="250" height="590">
<img src="https://github.com/user-attachments/assets/f8fef1c3-e370-4687-ae13-76990b20eaaf" width="250" height="590">
<img src="https://github.com/user-attachments/assets/5efec155-4212-4beb-ae7b-a7c04f534559" width="250" height="590">
<img src="https://github.com/user-attachments/assets/c450bc30-3c8d-46b8-ba5d-a7b237aabb6d" width="250" height="590">
<img src="https://github.com/user-attachments/assets/9a5fec6e-bf93-448e-a546-be20135a7b61" width="250" height="590">
<img src="https://github.com/user-attachments/assets/bb79221a-4940-490b-bd95-d57d5043baef" width="250" height="590">


## 6. Hướng dẫn sử dụng

* Video demo: 

## 7. Tác giả

| STT | MSSV     | Họ và tên                                                  | Lớp      | 
| --- | -------- | ---------------------------------------------------------- | -------- | 
| 1   | 21520123| [Huỳnh Mạnh Tường](https://github.com/tuonghuynh11)           | KTPM2021 | 
| 2   | 21520341| [Dương Ngọc Mẫn](https://github.com/DNM03)              | KTPM2021 | 
* Sinh viên khoa Công nghệ Phần mềm, trường Đại học Công nghệ Thông tin, Đại học Quốc gia thành phố Hồ Chí Minh.

## 8. Giảng viên hướng dẫn

* Cô Huỳnh Hồ Thị Mộng Trinh, giảng viên Khoa Công Nghệ Phần Mềm, trường Đại học Công nghệ Thông tin, Đại học Quốc gia Thành phố Hồ Chí Minh.
