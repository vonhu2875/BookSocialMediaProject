package com.vtbn.booksocial.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingSummaryResponse {
    private double averageStar;
    private long totalRatings;
    private long star5;
    private long star4;
    private long star3;
    private long star2;
    private long star1;
}