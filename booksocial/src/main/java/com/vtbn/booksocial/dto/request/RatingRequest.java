package com.vtbn.booksocial.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingRequest {

    @Min(value = 1, message = "STAR_INVALID")
    @Max(value = 5, message = "STAR_INVALID")
    private int star;

    private String review;
}
