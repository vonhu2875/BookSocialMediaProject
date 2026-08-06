package com.vtbn.booksocial.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
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
    CATEGORY_ALREADY_EXISTS(1015, "Danh mục đã tồn tại", HttpStatus.NOT_ACCEPTABLE)
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
