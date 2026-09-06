package com.vtbn.booksocial.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    USER_FORBIDDEN(403, "User forbidden", HttpStatus.FORBIDDEN),
    USER_ALREADY_EXISTS(
            1001,
            "User already exists",
            HttpStatus.BAD_REQUEST
    ),

    EMAIL_ALREADY_EXISTS(
            1002,
            "Email already exists",
            HttpStatus.BAD_REQUEST
    ),

    USER_NOT_FOUND(
            1003,
            "User not found",
            HttpStatus.NOT_FOUND
    ),

    INVALID_PASSWORD(
            1004,
            "Invalid password",
            HttpStatus.BAD_REQUEST
    ),

    UNAUTHENTICATED(
            1005,
            "Unauthenticated",
            HttpStatus.UNAUTHORIZED
    ),

    ACCESS_DENIED(
            1006,
            "Access denied",
            HttpStatus.FORBIDDEN
    ),

    INVALID_TOKEN(
            1007,
            "Invalid token",
            HttpStatus.UNAUTHORIZED
    ),

    TOKEN_EXPIRED(
            1008,
            "Token expired",
            HttpStatus.UNAUTHORIZED
    ),
    VALIDATION_FAILED(
            1009,
            "Validation failed",
            HttpStatus.BAD_REQUEST
    ),
    AVATAR_UPLOAD_ERROR(
            1010,
            "Upload avatar error",
            HttpStatus.NOT_ACCEPTABLE
    ),
    OLD_PASSWORD_INCORRECT(1011, "Mật khẩu cũ không chính xác", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID_SIZE(1012, "Mật khẩu phải chứa ít nhất 6 ký tự", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_REQUIRED(1013, "Vui lòng nhập mật khẩu cũ", HttpStatus.BAD_REQUEST),
    NEW_PASSWORD_REQUIRED(1014, "Vui lòng nhập mật khẩu mới", HttpStatus.BAD_REQUEST),
    CATEGORY_ALREADY_EXISTS(1015, "Danh mục đã tồn tại", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(1016, "Categoory not found",HttpStatus.NOT_FOUND),
    BOOK_NOT_FOUND(
            1017,
            "Book not found",
            HttpStatus.NOT_FOUND
    ),
    INVALID_BOOK_STATUS(1018, "Book status invalid", HttpStatus.BAD_REQUEST),
    CHAPTER_NUMBER_INVALID(1019, "Chapter number invalid", HttpStatus.BAD_REQUEST),
    CHAPTER_ALREADY_EXISTS(1020, "Chapter already exists", HttpStatus.BAD_REQUEST),
    CHAPTER_NOT_FOUND(1021,"Chapter not found", HttpStatus.NOT_FOUND),
    CHAPTER_FILE_REQUIRED(1022, "Chapter file required", HttpStatus.BAD_REQUEST),
    INVALID_CHAPTER_FILE(1023, "Invalid chapter file", HttpStatus.BAD_REQUEST),
    CHAPTER_FILE_READ_FAILED(1024, "chapter file read failed", HttpStatus.BAD_REQUEST),
    CHAPTER_CONTENT_EMPTY(1025, "Chapter content empty", HttpStatus.BAD_REQUEST),
    FILE_DELETE_ERROR(1026, "File delete error", HttpStatus.BAD_REQUEST),
    BOOK_ALREADY_EXISTS(1027, "Tiêu đề sách đã tồn tại", HttpStatus.BAD_REQUEST),
    UPLOAD_FILE_ERROR(1028,"Upload file error",HttpStatus.INTERNAL_SERVER_ERROR),
    COMMENT_NOT_FOUND(1029, "Comment not found", HttpStatus.NOT_FOUND),
    COMMENT_REPLY_NOT_ALLOWED(1030,"Cannot reply to a reply",HttpStatus.BAD_REQUEST),
    RATING_ALREADY_EXISTS(1031,"Rating already exists",HttpStatus.BAD_REQUEST),
    RATING_NOT_FOUND(1032,"Rating not found",HttpStatus.NOT_FOUND),
    STAR_INVALID(1031,"Số sao phải từ 1 đến 5",HttpStatus.BAD_REQUEST),
    CHAPTER_SUMMARY_GENERATION_FAILED(1032, "Chapter summary generation failed", HttpStatus.INTERNAL_SERVER_ERROR),
    GENERATE_QUIZ_FAILED(1033, "Generate quiz failed", HttpStatus.INTERNAL_SERVER_ERROR),
    CHAPTER_SUMMARY_NOT_FOUND(1034, "Chapter summary not found", HttpStatus.NOT_FOUND),
    GENERATE_SUMMARY_FAILED(1035, "generate summary failed", HttpStatus.INTERNAL_SERVER_ERROR),
    QUIZ_NOT_FOUND(1036, "Quiz not found", HttpStatus.NOT_FOUND),
    QUESTION_NOT_FOUND(1037, "Question not found", HttpStatus.NOT_FOUND),
    QUIZ_HAS_NO_QUESTIONS(1038, "Quiz has no question", HttpStatus.INTERNAL_SERVER_ERROR),
    ANSWER_REQUIRED(1039, "Answer required", HttpStatus.BAD_REQUEST),
    ANSWER_NOT_COMPLETE(1040, "Answer not complete", HttpStatus.BAD_REQUEST),
    DUPLICATE_QUESTION(1041, "Duplicate question", HttpStatus.BAD_REQUEST),
    INVALID_ANSWER(1042, "Invalid answer", HttpStatus.BAD_REQUEST),
    QUESTION_NOT_IN_QUIZ(1043, "Question not in quiz", HttpStatus.BAD_REQUEST),
    QUIZ_ALREADY_ATTEMPTED(1044, "Quiz already attempted", HttpStatus.BAD_REQUEST),
    QUIZ_ATTEMPT_NOT_FOUND(1045, "Quiz attempt not foung", HttpStatus.NOT_FOUND),
    BOOK_ALREADY_IN_BOOKSHELF(1046, "Book already in bookshelf", HttpStatus.BAD_REQUEST),
    BOOK_NOT_IN_BOOKSHELF(1047, "Book not in bookshelf", HttpStatus.BAD_REQUEST),
    CHAPTER_NOT_IN_BOOK(1048, "Chapter not in book", HttpStatus.BAD_REQUEST),
    AI_CHAT_FAILED(1049, "AI chat failed", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_BOOK_FILE_IMAGE(1050, "Invalid book file image", HttpStatus.BAD_REQUEST),
    USER_CANNOT_CHANGE_SHELF_STATUS(1051, "User cannot change yourshelf status", HttpStatus.BAD_REQUEST),
    USER_CANNOT_DELETE_SHELF(1052, "User cannot delete yourshelf", HttpStatus.BAD_REQUEST),
    ACCOUNT_DISABLED(1053, "Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt", HttpStatus.FORBIDDEN),
    AI_SERVICE_UNAVAILABLE(1054, "Không thể kết nối tới Trợ lý AI, vui lòng thử lại sau", HttpStatus.SERVICE_UNAVAILABLE),
    AI_RATE_LIMIT_EXCEEDED(1055, "Hệ thống đang quá tải, vui lòng chờ trong giây lát", HttpStatus.TOO_MANY_REQUESTS),
    DATA_INTEGRITY_VIOLATION(1056, "Dữ liệu đã tồn tại hoặc vi phạm ràng buộc, vui lòng kiểm tra lại thông tin", HttpStatus.CONFLICT),
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
