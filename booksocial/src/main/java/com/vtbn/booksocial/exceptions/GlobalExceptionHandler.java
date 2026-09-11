package com.vtbn.booksocial.exceptions;

import com.vtbn.booksocial.dto.response.ApiResponse;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.ai.retry.TransientAiException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Void>> handleAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(errorCode.getStatusCode()).body(response);
    }
    //handler xử lý lỗi khi dữ liệu client gửi lên không đúng ràng buộc validate đã khai báo trên DTO
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(ErrorCode.VALIDATION_FAILED.getCode())
                .message(message)
                .build();
        return ResponseEntity.status(ErrorCode.VALIDATION_FAILED.getStatusCode()).body(response);
    }
    //exception có sẵn của Spring Security, ném ra khi sai mật khẩu lúc đăng nhập do DaoAuthenticationProvider ném ra
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials() {
        ErrorCode errorCode = ErrorCode.INVALID_PASSWORD;
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(errorCode.getStatusCode()).body(response);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleUserNotFound() {
        ErrorCode errorCode = ErrorCode.USER_NOT_FOUND;
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(errorCode.getStatusCode()).body(response);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ApiResponse<Void>> handleDisabledAccount() {
        ErrorCode errorCode = ErrorCode.ACCOUNT_DISABLED;
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(errorCode.getStatusCode()).body(response);
    }

    @ExceptionHandler(TransientAiException.class)
    public ResponseEntity<ApiResponse<Void>> rateLimitExceeded() {
        ErrorCode errorCode = ErrorCode.AI_RATE_LIMIT_EXCEEDED;
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(errorCode.getStatusCode()).body(response);
    }

    @ExceptionHandler(NonTransientAiException.class)
    public ResponseEntity<ApiResponse<Void>> aiServiceUnvailable() {
        ErrorCode errorCode = ErrorCode.AI_SERVICE_UNAVAILABLE;
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(errorCode.getStatusCode()).body(response);
    }
    //Spring Data / tầng persistence (JDBC/Hibernate), ném ra khi thao tác ghi xuống DB vi phạm 1 ràng buộc toàn vẹn dữ liệu
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation() {
        ErrorCode errorCode = ErrorCode.DATA_INTEGRITY_VIOLATION;
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(errorCode.getStatusCode()).body(response);
    }
}