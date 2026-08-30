package com.vtbn.booksocial.services;

import com.vtbn.booksocial.dto.request.ChangePasswordRequest;
import com.vtbn.booksocial.dto.request.UpdateProfileRequest;
import com.vtbn.booksocial.dto.response.UserPublicResponse;
import com.vtbn.booksocial.dto.response.UserResponse;
import com.vtbn.booksocial.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserResponse getInfoUser(String username);
    UserResponse updateInfoUser(String username, UpdateProfileRequest request);

    void changePassword(String username, ChangePasswordRequest request);
    Page<UserResponse> getAllUser(Pageable pageable);
    void deleteUser(int id);
}
