package com.vtbn.booksocial.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    USER_FORBIDDEN(403, "Người dùng không có quyền truy cập", HttpStatus.FORBIDDEN),

    USER_ALREADY_EXISTS(
            1001,
            "Người dùng đã tồn tại",
            HttpStatus.BAD_REQUEST
    ),

    EMAIL_ALREADY_EXISTS(
            1002,
            "Email đã tồn tại",
            HttpStatus.BAD_REQUEST
    ),

    USER_NOT_FOUND(
            1003,
            "Không tìm thấy người dùng",
            HttpStatus.NOT_FOUND
    ),

    INVALID_PASSWORD(
            1004,
            "Mật khẩu không chính xác",
            HttpStatus.BAD_REQUEST
    ),

    UNAUTHENTICATED(
            1005,
            "Chưa xác thực",
            HttpStatus.UNAUTHORIZED
    ),

    ACCESS_DENIED(
            1006,
            "Từ chối truy cập",
            HttpStatus.FORBIDDEN
    ),

    INVALID_TOKEN(
            1007,
            "Token không hợp lệ",
            HttpStatus.UNAUTHORIZED
    ),

    TOKEN_EXPIRED(
            1008,
            "Token đã hết hạn",
            HttpStatus.UNAUTHORIZED
    ),

    VALIDATION_FAILED(
            1009,
            "Dữ liệu không hợp lệ",
            HttpStatus.BAD_REQUEST
    ),

    AVATAR_UPLOAD_ERROR(
            1010,
            "Tải ảnh đại diện lên thất bại",
            HttpStatus.NOT_ACCEPTABLE
    ),

    OLD_PASSWORD_INCORRECT(
            1011,
            "Mật khẩu cũ không chính xác",
            HttpStatus.BAD_REQUEST
    ),

    PASSWORD_INVALID_SIZE(
            1012,
            "Mật khẩu phải chứa ít nhất 6 ký tự",
            HttpStatus.BAD_REQUEST
    ),

    OLD_PASSWORD_REQUIRED(
            1013,
            "Vui lòng nhập mật khẩu cũ",
            HttpStatus.BAD_REQUEST
    ),

    NEW_PASSWORD_REQUIRED(
            1014,
            "Vui lòng nhập mật khẩu mới",
            HttpStatus.BAD_REQUEST
    ),

    CATEGORY_ALREADY_EXISTS(
            1015,
            "Danh mục đã tồn tại",
            HttpStatus.BAD_REQUEST
    ),

    CATEGORY_NOT_FOUND(
            1016,
            "Không tìm thấy danh mục",
            HttpStatus.NOT_FOUND
    ),

    BOOK_NOT_FOUND(
            1017,
            "Không tìm thấy sách",
            HttpStatus.NOT_FOUND
    ),

    INVALID_BOOK_STATUS(
            1018,
            "Trạng thái sách không hợp lệ",
            HttpStatus.BAD_REQUEST
    ),

    CHAPTER_NUMBER_INVALID(
            1019,
            "Số chương không hợp lệ",
            HttpStatus.BAD_REQUEST
    ),

    CHAPTER_ALREADY_EXISTS(
            1020,
            "Chương sách đã tồn tại",
            HttpStatus.BAD_REQUEST
    ),

    CHAPTER_NOT_FOUND(
            1021,
            "Không tìm thấy chương sách",
            HttpStatus.NOT_FOUND
    ),

    CHAPTER_FILE_REQUIRED(
            1022,
            "Vui lòng cung cấp tệp chương sách",
            HttpStatus.BAD_REQUEST
    ),

    INVALID_CHAPTER_FILE(
            1023,
            "Tệp chương sách không hợp lệ",
            HttpStatus.BAD_REQUEST
    ),

    CHAPTER_FILE_READ_FAILED(
            1024,
            "Đọc tệp chương sách thất bại",
            HttpStatus.BAD_REQUEST
    ),

    CHAPTER_CONTENT_EMPTY(
            1025,
            "Nội dung chương sách không được để trống",
            HttpStatus.BAD_REQUEST
    ),

    FILE_DELETE_ERROR(
            1026,
            "Xóa tệp thất bại",
            HttpStatus.BAD_REQUEST
    ),

    BOOK_ALREADY_EXISTS(
            1027,
            "Tiêu đề sách đã tồn tại",
            HttpStatus.BAD_REQUEST
    ),

    UPLOAD_FILE_ERROR(
            1028,
            "Tải tệp lên thất bại",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),

    COMMENT_NOT_FOUND(
            1029,
            "Không tìm thấy bình luận",
            HttpStatus.NOT_FOUND
    ),

    COMMENT_REPLY_NOT_ALLOWED(
            1030,
            "Không thể trả lời một bình luận trả lời khác",
            HttpStatus.BAD_REQUEST
    ),
    STAR_INVALID(
            1031,
            "Số sao phải từ 1 đến 5",
            HttpStatus.BAD_REQUEST
    ),

    CHAPTER_SUMMARY_GENERATION_FAILED(
            1032,
            "Tạo tóm tắt chương sách thất bại",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),

    GENERATE_QUIZ_FAILED(
            1033,
            "Tạo bài kiểm tra thất bại",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),

    CHAPTER_SUMMARY_NOT_FOUND(
            1034,
            "Không tìm thấy tóm tắt chương sách",
            HttpStatus.NOT_FOUND
    ),

    GENERATE_SUMMARY_FAILED(
            1035,
            "Tạo tóm tắt thất bại",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),

    QUIZ_NOT_FOUND(
            1036,
            "Không tìm thấy bài kiểm tra",
            HttpStatus.NOT_FOUND
    ),

    QUESTION_NOT_FOUND(
            1037,
            "Không tìm thấy câu hỏi",
            HttpStatus.NOT_FOUND
    ),

    QUIZ_HAS_NO_QUESTIONS(
            1038,
            "Bài kiểm tra không có câu hỏi",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),

    ANSWER_REQUIRED(
            1039,
            "Vui lòng chọn đáp án",
            HttpStatus.BAD_REQUEST
    ),

    ANSWER_NOT_COMPLETE(
            1040,
            "Chưa hoàn thành tất cả câu trả lời",
            HttpStatus.BAD_REQUEST
    ),

    DUPLICATE_QUESTION(
            1041,
            "Câu hỏi bị trùng lặp",
            HttpStatus.BAD_REQUEST
    ),

    INVALID_ANSWER(
            1042,
            "Đáp án không hợp lệ",
            HttpStatus.BAD_REQUEST
    ),

    QUESTION_NOT_IN_QUIZ(
            1043,
            "Câu hỏi không thuộc bài kiểm tra",
            HttpStatus.BAD_REQUEST
    ),

    QUIZ_ALREADY_ATTEMPTED(
            1044,
            "Bài kiểm tra đã được thực hiện",
            HttpStatus.BAD_REQUEST
    ),

    QUIZ_ATTEMPT_NOT_FOUND(
            1045,
            "Không tìm thấy lượt làm bài kiểm tra",
            HttpStatus.NOT_FOUND
    ),

    BOOK_ALREADY_IN_BOOKSHELF(
            1046,
            "Sách đã có trong tủ sách",
            HttpStatus.BAD_REQUEST
    ),

    BOOK_NOT_IN_BOOKSHELF(
            1047,
            "Sách không có trong tủ sách",
            HttpStatus.BAD_REQUEST
    ),

    CHAPTER_NOT_IN_BOOK(
            1048,
            "Chương sách không thuộc sách này",
            HttpStatus.BAD_REQUEST
    ),

    AI_CHAT_FAILED(
            1049,
            "Trò chuyện với AI thất bại",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),

    INVALID_BOOK_FILE_IMAGE(
            1050,
            "Ảnh bìa sách không hợp lệ",
            HttpStatus.BAD_REQUEST
    ),

    USER_CANNOT_CHANGE_SHELF_STATUS(
            1051,
            "Người dùng không thể thay đổi trạng thái tủ sách",
            HttpStatus.BAD_REQUEST
    ),

    USER_CANNOT_DELETE_SHELF(
            1052,
            "Người dùng không thể xóa tủ sách",
            HttpStatus.BAD_REQUEST
    ),

    ACCOUNT_DISABLED(
            1053,
            "Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt",
            HttpStatus.FORBIDDEN
    ),

    AI_SERVICE_UNAVAILABLE(
            1054,
            "Không thể kết nối tới Trợ lý AI, vui lòng thử lại sau",
            HttpStatus.SERVICE_UNAVAILABLE
    ),

    AI_RATE_LIMIT_EXCEEDED(
            1055,
            "Hệ thống đang quá tải, vui lòng chờ trong giây lát",
            HttpStatus.TOO_MANY_REQUESTS
    ),

    DATA_INTEGRITY_VIOLATION(
            1056,
            "Dữ liệu đã tồn tại hoặc vi phạm ràng buộc, vui lòng kiểm tra lại thông tin",
            HttpStatus.CONFLICT
    ),
    RATING_ALREADY_EXISTS(
            1057,
                    "Người dùng đã đánh giá sách",
            HttpStatus.BAD_REQUEST
            ),
    RATING_NOT_FOUND(
            1058,
                    "Không tìm thấy đánh giá",
            HttpStatus.NOT_FOUND
            ),
    ;
    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
