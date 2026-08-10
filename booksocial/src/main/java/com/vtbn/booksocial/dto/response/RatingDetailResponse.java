package com.vtbn.booksocial.dto.response;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingDetailResponse {
    private int id;
    private int star;
    private String review;
    private int userId;
    private String username;
    private String avatar;
    private int bookId;
    private String bookTitle;
    private Instant createdDate;
    private Instant updatedDate;
}
