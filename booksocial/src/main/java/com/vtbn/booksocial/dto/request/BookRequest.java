package com.vtbn.booksocial.dto.request;

import com.vtbn.booksocial.entities.Category;
import com.vtbn.booksocial.enums.BookLanguage;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookRequest {
    @NotBlank
    private String title;
    private String description;
    private BookLanguage language;
    private List<Integer> categoryIds;
    private MultipartFile coverImage;
}
