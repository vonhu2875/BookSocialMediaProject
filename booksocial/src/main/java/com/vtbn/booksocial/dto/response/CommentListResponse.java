package com.vtbn.booksocial.dto.response;

import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentListResponse {
    private int id;
    private String content;
    private int userId;
    private String username;
    private String avatar;
    private Integer parentCommentId;
    private Instant createdDate;
    private Instant updatedDate;
}
