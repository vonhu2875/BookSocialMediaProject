package com.vtbn.booksocial.controllers;

import com.vtbn.booksocial.dto.request.ChangePasswordRequest;
import com.vtbn.booksocial.dto.request.UpdateProfileRequest;
import com.vtbn.booksocial.dto.response.ApiResponse;
import com.vtbn.booksocial.dto.response.UserPublicResponse;
import com.vtbn.booksocial.dto.response.UserResponse;
import com.vtbn.booksocial.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/my-info")
    public ApiResponse<UserResponse> getMyInfo(Authentication authentication) {
        var result = userService.getInfoUser(authentication.getName());
        return ApiResponse.<UserResponse>builder().result(result).build();
    }

    @PutMapping("/my-info")
    public ApiResponse<UserResponse> updateMyInfo(Authentication authentication, @ModelAttribute UpdateProfileRequest request) {
        var result = userService.updateInfoUser(authentication.getName(), request);
        return ApiResponse.<UserResponse>builder().message("update success").result(result).build();
    }

    @PutMapping("/change-password")
    public ApiResponse<Void> changePassword(Authentication authentication, @RequestBody @Valid ChangePasswordRequest request) {
        userService.changePassword(authentication.getName(), request);
        return ApiResponse.<Void>builder().message("change password success").build();
    }

    @GetMapping("/{username}")
    public ApiResponse<UserPublicResponse> getPublicInfoUser(@PathVariable String username) {
        var result = userService.userPublicResponse(username);
        return ApiResponse.<UserPublicResponse>builder().result(result).build();
    }

    @GetMapping
    public ApiResponse<Page<UserResponse>> getAllUsers(Pageable pageable) {
        var result = userService.getAllUser(pageable);
        return ApiResponse.<Page<UserResponse>>builder().result(result).build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ApiResponse.<Void>builder().message("delete user success").build();
    }
}