## 🚀 Hướng dẫn khởi chạy

Dự án sử dụng cơ chế chạy đa luồng để đảm bảo hiệu năng. Bạn có thể chọn các cách sau:

### Cách 1: Chạy tất cả dịch vụ cùng lúc (Khuyên dùng)

Để chạy đồng thời Server, Queue và Schedule chỉ trong một Terminal duy nhất:

```bash
npm run dev
```

_Lưu ý: Bạn cần cài đặt `concurrently` (đã có sẵn trong devDependencies)._

### Cách 2: Chạy từng dịch vụ riêng biệt

Nếu bạn muốn theo dõi log chi tiết của từng phần, hãy mở các Terminal riêng:

1.  **Main API Server**:
    ```bash
    npm run server
    ```
2.  **Background Worker (Queue)**:
    ```bash
    npm run queue
    ```
3.  **Scheduled Tasks (Schedules)**:
    ```bash
    npm run schedule
    ```

---

## 🏗️ Cấu trúc hệ thống chính

1.  **`server.js`**: Điểm khởi đầu của ứng dụng Express API. Nơi tiếp nhận và phản hồi các request từ phía người dùng.
2.  **`queue.js`**: Worker chạy ngầm. Nó liên tục kiểm tra database để lấy các "Jobs" đang chờ xử lý (như gửi email xác thực, email đổi mật khẩu).
3.  **`schedule.js`**: Chạy các tác vụ theo lịch trình định sẵn (Cron Job). Ví dụ:
    - **3:00 AM**: Backup Database và đẩy lên Google Drive.
    - **1:00 AM**: Dọn dẹp các mã Token đã hết hạn trong database.

---

## 🛠️ Cài đặt môi trường

1.  **Cài đặt dependencies**:
    ```bash
    npm install
    ```
2.  **Cấu hình file `.env`**: Tạo file `.env` từ `.env.example` và điền đầy đủ:
    - Thông tin kết nối Database (MySQL).
    - Thông tin cấu hình Mail (SMTP).
    - Cấu hình Google Drive API (cho chức năng Backup).
    - Cấu hình thư mục Backup của Rclone (nếu sử dụng).

---

## Các tính năng

- **Priority Queue**: Hàng đợi có phân cấp ưu tiên (xử lý việc quan trọng trước).
- **Auto Backup**: Tự động sao lưu dữ liệu mỗi ngày lên Google Drive.
