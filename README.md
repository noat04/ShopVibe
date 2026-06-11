# 🛍️ ShopVibe — Nền Tảng Thương Mại Điện Tử Fullstack

> Dự án website bán hàng với hệ thống backend hiện đại, tích hợp thanh toán online VNPay và xác thực đa phương thức.

---

## 📌 Giới Thiệu

**ShopVibe** là nền tảng thương mại điện tử cho phép khách hàng mua sắm trực tuyến với đầy đủ tính năng hiện đại: giỏ hàng bền vững đồng bộ đa thiết bị, đặt hàng, thanh toán qua VNPay, đăng nhập bằng Google, và bảng quản trị dành cho nhân viên/admin. Backend xây dựng theo **Layered Architecture** chuẩn trên nền tảng **.NET 8.0**.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend

| Công nghệ | Mục đích |
|---|---|
| React *(hoặc cập nhật theo thực tế)* | Giao diện người dùng (SPA) |
| Axios / Fetch API | Giao tiếp REST API với Backend |
| CSS / Tailwind CSS | Styling giao diện |

### Backend

| Công nghệ | Mục đích |
|---|---|
| **ASP.NET Core Web API (.NET 8.0)** | Framework chính xây dựng RESTful API hiệu năng cao |
| **ASP.NET Core Identity** | Quản lý User, Role, mã hóa mật khẩu, phiên đăng nhập |
| **Entity Framework Core (Code-First)** | ORM thao tác SQL Server, quản lý Migration tự động |
| **AutoMapper** | Tự động mapping Entity ↔ DTO, giảm boilerplate code |
| **Swagger UI (Swashbuckle)** | Tự động sinh tài liệu API, hỗ trợ test trực tiếp trên trình duyệt |
| **System.IdentityModel.Tokens.Jwt** | Tạo và giải mã JWT Token |
| **Google.Apis.Auth** | Xác thực Google OAuth Token khi đăng nhập bằng Gmail |
| **SMTP / EmailSender** | Gửi email xác nhận đăng ký, thông báo đơn hàng |
| **SimpleMiddleware (Custom)** | Log request, Global Error Handling, kiểm tra header |

### Database

| Database | Vai trò |
|---|---|
| **SQL Server** | Database chính — lưu User, Sản phẩm, Đơn hàng, Giỏ hàng |
| **MongoDB** | Dữ liệu phi cấu trúc, log hệ thống, dữ liệu sản phẩm phức tạp |

### Tích hợp bên thứ ba

| Dịch vụ | Mục đích |
|---|---|
| **VNPay** | Cổng thanh toán online (tạo URL, xác thực hash secret, nhận IPN callback) |
| **Google OAuth 2.0** | Đăng nhập bằng tài khoản Google |

---

## 🏗️ Kiến Trúc Hệ Thống

**Mô hình:** Layered Architecture (4 tầng)

```
┌──────────────────────────────────────┐
│         Frontend (React SPA)         │
└──────────────────┬───────────────────┘
                   │ REST API (HTTP/HTTPS + JWT)
┌──────────────────▼───────────────────┐
│           Controller Layer           │
│  Auth · Product · Order · Payment    │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│            Service Layer             │
│  Business Logic · VnPayService       │
│  EmailSender · Token / Auth Logic    │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│          Repository Layer            │
│  Entity Framework Core · MongoDB     │
└──────────┬───────────────────┬───────┘
           │                   │
    ┌──────▼──────┐     ┌──────▼──────┐
    │ SQL Server  │     │   MongoDB   │
    │  (Primary)  │     │   (NoSQL)   │
    └─────────────┘     └─────────────┘
```

### Luồng xác thực (Auth Flow)

```
[Email/Password Login]
  → Server xác thực → Cấp AccessToken (ngắn hạn) + RefreshToken (dài hạn)

[Token hết hạn]
  → Client gửi RefreshToken → Server cấp AccessToken mới (không cần login lại)

[Google Login]
  → Client gửi Google ID Token → Server xác thực qua Google.Apis.Auth → Cấp JWT
```

### Luồng thanh toán VNPay

```
[Khách đặt hàng]
  → Server tạo URL thanh toán (ký bằng hash secret) → Redirect sang VNPay
  → VNPay xử lý → Gọi IPN/Return URL → Server xác thực chữ ký
  → Cập nhật trạng thái đơn hàng: Thành công / Thất bại
```

---

## ✅ Chức Năng Chính

### 🔐 Xác thực & Phân quyền
- Đăng ký tài khoản, mã hóa mật khẩu chuẩn (ASP.NET Core Identity)
- Đăng nhập → nhận JWT AccessToken + RefreshToken, tự động gia hạn phiên
- **Đăng nhập bằng Google OAuth 2.0**
- Phân quyền: `Customer` (khách hàng) / `Employee` (nhân viên, admin)
- Gửi email xác nhận đăng ký & thông báo đơn hàng qua SMTP

### 🛒 Sản phẩm & Danh mục
- Quản lý sản phẩm với phân loại đa cấp (ProductCategories)
- **Biến thể sản phẩm (ProductVariants):** hỗ trợ Size, Màu sắc
- DTO Pattern — chỉ trả dữ liệu cần thiết, ẩn cấu trúc DB thật

### 🛍️ Giỏ hàng & Đặt hàng
- **Persistent Cart** — giỏ hàng lưu Database, đồng bộ mọi thiết bị
- Luồng đặt hàng: `Cart → Order (thông tin giao hàng) → OrderDetail (từng sản phẩm)`
- Xem lịch sử đơn hàng & theo dõi trạng thái

### 💳 Thanh toán
- **VNPay** — tạo link thanh toán có chữ ký bảo mật (hash secret)
- Xử lý callback IPN để tự động cập nhật trạng thái đơn hàng
- Hỗ trợ cả luồng thanh toán thành công và thất bại

### 👤 Quản lý Người dùng
- **Customer:** thông tin cá nhân, địa chỉ giao hàng, lịch sử đơn
- **Employee/Admin:** quản lý sản phẩm, đơn hàng, người dùng qua trang Admin

---

## 🔒 Bảo Mật

- **JWT + Refresh Token** — tự động gia hạn phiên, không lưu session phía server
- **ASP.NET Core Identity** — mã hóa mật khẩu chuẩn, quản lý Role chặt chẽ
- **VNPay Hash Secret** — mọi giao dịch đều có chữ ký xác thực
- **Google Token Validation** — xác thực phía server, không tin dữ liệu từ client
- **Global Error Handling** qua middleware — không lộ stack trace ra ngoài
- **DTO Pattern** — tách biệt Entity và response, ẩn cấu trúc database

---

## 🚀 Hướng Phát Triển Tương Lai

### Tính năng
- **Đa cổng thanh toán:** MoMo, ZaloPay, Stripe
- **Đánh giá & nhận xét sản phẩm** (rating, review)
- **Mã giảm giá / voucher**, chương trình khuyến mãi theo thời gian
- **Thông báo realtime** (SignalR) — cập nhật trạng thái đơn hàng tức thì
- **Tích hợp vận chuyển** (GHTK / GHN) — tính phí ship và tracking đơn
- **Wishlist** — lưu sản phẩm yêu thích
- **Tìm kiếm nâng cao** — lọc theo giá, size, màu sắc, danh mục

### Kiến trúc & DevOps
- **CI/CD** với GitHub Actions — tự động test, build, deploy
- **Docker hóa** toàn bộ backend + database
- **Unit test / Integration test** với xUnit cho các luồng quan trọng
- **Redis Cache** — giảm tải truy vấn sản phẩm, giỏ hàng thường xuyên đọc
- **Logging tập trung** với Serilog + Seq / ELK Stack
- **Rate limiting & CORS** bảo vệ API khỏi bị lạm dụng

### Bảo mật nâng cao
- **Xác thực 2 lớp (2FA)** qua email hoặc authenticator app
- **Refresh Token Rotation** — thu hồi token cũ sau mỗi lần làm mới
- **Audit log** — ghi lại mọi thao tác quan trọng của admin

---

*ShopVibe — Backend hiện đại: Layered Architecture · JWT + Refresh Token · Code-First Migration · DTO Pattern · VNPay Integration*
