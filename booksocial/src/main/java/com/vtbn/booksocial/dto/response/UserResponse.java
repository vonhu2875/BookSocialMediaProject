package com.vtbn.booksocial.dto.response;

import com.vtbn.booksocial.enums.UserRole;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private int id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String avatar;
    private UserRole role;
    private boolean active;
    private Instant createdDate;
}
