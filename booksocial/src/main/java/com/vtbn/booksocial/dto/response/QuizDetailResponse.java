package com.vtbn.booksocial.dto.response;

import com.vtbn.booksocial.entities.Chapter;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDetailResponse {
    private int id;
    private String summary;
    private List<QuestionResponse> questions;
    private String chapterTitle;
    private String bookTitle;
    private int chapterId;
}
