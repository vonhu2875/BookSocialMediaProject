package com.vtbn.booksocial.controllers;

import com.vtbn.booksocial.dto.request.LoginRequest;
import com.vtbn.booksocial.dto.request.RegisterRequest;
import com.vtbn.booksocial.dto.response.ApiResponse;
import com.vtbn.booksocial.dto.response.LoginResponse;
import com.vtbn.booksocial.dto.response.UserResponse;
import com.vtbn.booksocial.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        var result = authService.register(request);
        return ApiResponse.<UserResponse>builder().result(result).build();
    }
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        var result = authService.login(request);
        return ApiResponse.<LoginResponse>builder().result(result).build();
    }

    @PostMapping("/logout")
    public ApiResponse<String> logout(@RequestHeader("Authorization") String authHeader) {
        authService.logout(authHeader);
        return ApiResponse.<String>builder().result("Logout Success").build();
    }
}
