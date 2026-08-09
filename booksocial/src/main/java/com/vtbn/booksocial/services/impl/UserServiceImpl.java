package com.vtbn.booksocial.services.impl;

import com.vtbn.booksocial.dto.request.ChangePasswordRequest;
import com.vtbn.booksocial.dto.request.UpdateProfileRequest;
import com.vtbn.booksocial.dto.response.UserPublicResponse;
import com.vtbn.booksocial.dto.response.UserResponse;
import com.vtbn.booksocial.entities.User;
import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.mappers.UserMapper;
import com.vtbn.booksocial.repositories.UserRepository;
import com.vtbn.booksocial.services.CloudinaryService;
import com.vtbn.booksocial.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Lazy})
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final CloudinaryService cloudinaryService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse getInfoUser(String username) {
        User user = userRepository.findByUsername(username);
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateInfoUser(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username);
        if(user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        if (request.getFirstName() != null)
            user.setFirstName(request.getFirstName());
        if (request.getLastName() != null)
            user.setLastName(request.getLastName());
        if(request.getAvatarFile() != null && !request.getAvatarFile().isEmpty()) {
            String avatarURL = cloudinaryService.uploadFile(request.getAvatarFile(), "booksocial/avatars");
            user.setAvatar(avatarURL);
        }
        User userUpdated = userRepository.save(user);
        return userMapper.toResponse(userUpdated);
    }

    @Override
    public UserPublicResponse userPublicResponse(String username) {
        User user = userRepository.findByUsername(username);
        if(user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        return userMapper.toPublicResponse(user);
    }

    @Override
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username);
        if(user == null)
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        if(!passwordEncoder.matches(request.getOldPassword(), user.getPassword()))
            throw new AppException(ErrorCode.OLD_PASSWORD_INCORRECT);
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public Page<UserResponse> getAllUser(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(userMapper::toResponse);
    }

    @Override
    public void deleteUser(int id) {
        User user = userRepository.findById(id);
        if(user == null)
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        userRepository.delete(user);
    }
}
