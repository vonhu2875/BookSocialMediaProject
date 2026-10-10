# Nền tảng hỗ trợ đọc và khai thác nội dung sách dùng RAG

Ứng dụng web cho phép đọc sách theo từng chương, kèm trợ lý AI trả lời câu hỏi **chỉ dựa trên nội dung của chính cuốn sách** nhờ kỹ thuật Retrieval-Augmented Generation (RAG).

Người dùng có thể đăng và đọc sách, thảo luận theo chương, quản lý tủ sách cá nhân và ôn tập bằng tóm tắt chương và câu hỏi trắc nghiệm do AI tạo. Quản trị viên kiểm duyệt nội dung qua trang quản trị riêng.

> Đồ án ngành — Khoa Công nghệ thông tin, Trường Đại học Mở TP. Hồ Chí Minh.

---

## Tính năng

**Đọc sách và cộng đồng**
- Đăng ký / đăng nhập bằng tài khoản thường hoặc **Google Sign-In**
- Đăng sách theo từng chương bằng cách tải lên file **PDF / DOCX** (hệ thống tự trích xuất văn bản)
- Quy trình kiểm duyệt sách: `PENDING` → `APPROVED` / `REJECTED`; sửa sách sẽ đưa sách về lại `PENDING`
- Đọc chương có phân trang, tùy chỉnh giao diện / phông chữ / cỡ chữ và lưu tiến độ đọc
- Bình luận theo chương, đánh giá sao kèm nhận xét, tủ sách cá nhân (`READING` / `COMPLETED`)
- Tìm kiếm theo tên sách (không phân biệt hoa thường và dấu), lọc theo thể loại, phân trang

**Tính năng AI (Gemini + Spring AI)**
- **Hỏi đáp RAG** trong phạm vi một chương hoặc cả cuốn sách, có lưu lịch sử hội thoại
- **Tóm tắt chương**
- **Sinh câu hỏi trắc nghiệm**: 10 câu cho mỗi chương (đầu ra JSON có cấu trúc), tự động chấm điểm, lưu lịch sử làm bài

**Quản trị**
- Admin Dashboard: duyệt / từ chối sách, quản lý người dùng (khóa / mở khóa / xóa), quản lý thể loại, xóa sách, chương, đánh giá và bình luận vi phạm

---

## Cách pipeline RAG hoạt động

1. **Lập chỉ mục** (tự động chạy khi tạo hoặc cập nhật chương)
   - Nội dung chương được chia thành các đoạn (`TokenTextSplitter`, tối đa 800 token mỗi đoạn)
   - Mỗi đoạn được nhúng bằng `gemini-embedding-001` (768 chiều)
   - Vector được lưu trong PostgreSQL qua **pgvector** (chỉ mục HNSW, khoảng cách cosine) cùng metadata (`chapterId`, `bookId`, `chapterNumber`, tiêu đề)
   - Khi khởi động, nếu kho vector còn trống, các chương hiện có sẽ được lập chỉ mục lại
2. **Truy vấn**
   - Câu hỏi được nhúng và so khớp với các đoạn đã lưu (top 5, ngưỡng tương đồng 0.5), lọc theo `chapterId` hoặc `bookId`
   - Các đoạn tìm được, 6 lượt hội thoại gần nhất và câu hỏi được gửi tới Gemini
   - System prompt yêu cầu mô hình chỉ trả lời dựa trên ngữ cảnh được cung cấp và thông báo khi nội dung không đề cập đến câu hỏi
3. Mỗi cặp câu hỏi – câu trả lời được lưu vào lịch sử trò chuyện của người dùng

Dữ liệu quan hệ và vector nằm chung trong **một PostgreSQL** (extension pgvector), không cần cơ sở dữ liệu vector riêng.

---

## Công nghệ sử dụng

| Tầng | Công nghệ |
|---|---|
| Backend | Java, Spring Boot 4.1, Spring Security, Spring Data JPA, Maven |
| AI / RAG | Spring AI 2.0 (Google GenAI), mô hình chat Gemini, `gemini-embedding-001`, pgvector |
| Cơ sở dữ liệu | PostgreSQL + pgvector (+ `unaccent` cho tìm kiếm) |
| Xác thực | JWT (JJWT) stateless, thu hồi token khi đăng xuất, xác minh Google ID token |
| Tệp | Apache PDFBox, Apache POI, Cloudinary |
| Tài liệu API | springdoc-openapi (Swagger UI) |
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, Axios, `@react-oauth/google` |

---

## Kiến trúc

Mô hình Client–Server hai tầng. Backend là một ứng dụng Spring Boot tổ chức theo các lớp:

```
React SPA ──HTTPS (JSON / multipart)──▶ JwtAuthenticationFilter
                                          └▶ Controller ─▶ Service ─▶ Repository ─▶ PostgreSQL (+ pgvector)
                                                              ├▶ Cloudinary        (ảnh, file chương)
                                                              ├▶ Gemini            (chat + embedding)
                                                              └▶ Google Identity   (xác minh ID token)
```

- Vai trò: `READER`, `ADMIN`
- Lỗi được xử lý tập trung (`GlobalExceptionHandler`) và trả về theo định dạng `ApiResponse` thống nhất

---

## Cấu trúc dự án

```
.
├── booksocial/            # Backend (Spring Boot)
│   └── src/main/java/com/vtbn/booksocial/
│       ├── configs/       # Security, ChatClient, khởi tạo chỉ mục RAG, ...
│       ├── controllers/
│       ├── services/ (+ impl/)
│       ├── repositories/
│       ├── entities/ enums/ mappers/ dto/
│       ├── security/      # JWT service và filter
│       └── exceptions/
└── booksocialwebsite/     # Frontend (React + Vite)
    └── src/
        ├── pages/  components/  services/  contexts/  utils/
```

---

## Hướng dẫn cài đặt

### Yêu cầu
- JDK (phiên bản theo `pom.xml`) và Maven (hoặc dùng `mvnw` có sẵn)
- Node.js (bản LTS)
- PostgreSQL có hỗ trợ extension **pgvector**
- API key của Google AI (Gemini)
- Tài khoản Cloudinary
- Google OAuth Client ID (cho Google Sign-In)

### 1. Cơ sở dữ liệu
```sql
CREATE DATABASE booksocial;
\c booksocial
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS unaccent;
```

### 2. Backend
Cấu hình được đọc từ `booksocial/src/main/resources/application.properties`. Các thông tin bí mật cần đặt qua **biến môi trường** và không được commit lên Git:

```bash
export JWT_SECRET=<chuỗi ngẫu nhiên đủ dài>
export GOOGLE_API_KEY=<Gemini API key>
# Đặt thêm thông tin đăng nhập database, khóa Cloudinary và Google Client ID
# đúng theo tên biến được tham chiếu trong application.properties
```

```bash
cd booksocial
./mvnw spring-boot:run
```

- Lần chạy đầu, schema vector được tạo tự động (`spring.ai.vectorstore.pgvector.initialize-schema=true`, chỉ dùng cho môi trường phát triển).
- Swagger UI tại `/swagger-ui/index.html` trên cổng của backend.

### 3. Frontend
```bash
cd booksocialwebsite
npm install
npm run dev
```
Mở `http://localhost:5173`. Cấu hình CORS của backend cho phép nguồn này.

---

## Hạn chế còn tồn tại

- Xóa sách sẽ xóa các chương qua cascade của JPA, nhưng các vector tương ứng trong `vector_store` chưa được dọn
- Việc lập chỉ mục chương chạy đồng bộ trong request; chương rất dài có thể làm phản hồi chậm (dự kiến chuyển sang bất đồng bộ)
- `initialize-schema=true` của pgvector chỉ phù hợp khi phát triển; môi trường thực tế nên tạo schema thủ công
- Chưa kiểm thử tải; chưa có module thống kê / báo cáo cho quản trị viên

## Hướng phát triển
- Lập chỉ mục bất đồng bộ và dọn vector mồ côi
- Giới hạn tần suất gọi các API AI
- Dashboard thống kê cho quản trị viên (người dùng mới, sách được đọc nhiều, mức sử dụng AI)
- Thông báo, giao diện yêu thích, gợi ý sách theo lịch sử đọc

---

## Tác giả
**Võ Thị Bích Như** — [GitHub](https://github.com/vonhu2875)
