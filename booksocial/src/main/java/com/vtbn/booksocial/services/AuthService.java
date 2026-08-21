package com.vtbn.booksocial.services;

import com.vtbn.booksocial.dto.request.GoogleLoginRequest;
import com.vtbn.booksocial.dto.request.LoginRequest;
import com.vtbn.booksocial.dto.request.RegisterRequest;
import com.vtbn.booksocial.dto.response.LoginResponse;
import com.vtbn.booksocial.dto.response.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    LoginResponse login (LoginRequest request);
    void logout(String authHeader);
    LoginResponse googleLogin(GoogleLoginRequest request);
}
