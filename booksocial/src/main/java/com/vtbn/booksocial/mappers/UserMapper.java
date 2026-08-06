package com.vtbn.booksocial.mappers;

import com.vtbn.booksocial.dto.request.RegisterRequest;
import com.vtbn.booksocial.dto.response.UserPublicResponse;
import com.vtbn.booksocial.dto.response.UserResponse;
import com.vtbn.booksocial.entities.User;
import org.springframework.stereotype.Component;

//đánh dấu một Java class trở thành một Spring Bean và giao quyền quản lý vòng đời (tạo mới, lưu trữ, tiêm phụ thuộc) của Class đó cho Spring Container (ApplicationContext).
@Component
public class UserMapper {
    public User toEntity(RegisterRequest request) {
        if (request == null) {
            return null;
        }
        return User.builder().
                username(request.getUsername()).
                email(request.getEmail()).
                firstName(request.getFirstName()).
                lastName(request.getLastName()).
                build();
    }

    public UserResponse toResponse(User user){
        if(user == null){
            return null;
        }
        return UserResponse.builder().id(user.getId()).username(user.getUsername()).email(user.getEmail()).firstName(user.getFirstName()).lastName(user.getLastName()).avatar(user.getAvatar())
                .role(user.getRole()).active(user.isActive()).createdDate(user.getCreatedDate()).build();
    }

    public UserPublicResponse toPublicResponse(User user) {
        if(user == null)
            return null;
        return UserPublicResponse.builder().id(user.getId()).username(user.getUsername()).fullName(user.getFirstName() + " " + user.getLastName()).avatar(user.getAvatar()).build();
    }
}
