package com.vtbn.booksocial.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPublicResponse {
    private int id;
    private String username;
    private String fullName;
    private String avatar;
}
