package com.vtbn.booksocial.mappers;

import com.vtbn.booksocial.dto.request.RatingRequest;
import com.vtbn.booksocial.dto.response.RatingDetailResponse;
import com.vtbn.booksocial.dto.response.RatingListResponse;
import com.vtbn.booksocial.dto.response.RatingSummaryResponse;
import com.vtbn.booksocial.entities.Rating;
import org.springframework.stereotype.Component;

@Component
public class RatingMapper {
    public Rating toRating(RatingRequest request) {
        return Rating.builder()
                .star(request.getStar())
                .review(request.getReview())
                .build();
    }

    public RatingListResponse toRatingListResponse(Rating rating) {
        return RatingListResponse.builder()
                .id(rating.getId())
                .star(rating.getStar())
                .review(rating.getReview())
                .userId(rating.getUser().getId())
                .username(rating.getUser().getUsername())
                .avatar(rating.getUser().getAvatar())
                .createdDate(rating.getCreatedDate())
                .build();
    }

    public RatingDetailResponse toRatingDetailResponse(Rating rating) {
        return RatingDetailResponse.builder()
                .id(rating.getId())
                .star(rating.getStar())
                .review(rating.getReview())
                .userId(rating.getUser().getId())
                .username(rating.getUser().getUsername())
                .avatar(rating.getUser().getAvatar())
                .bookId(rating.getBook().getId())
                .bookTitle(rating.getBook().getTitle())
                .createdDate(rating.getCreatedDate())
                .updatedDate(rating.getUpdatedDate())
                .build();
    }
    public RatingSummaryResponse toRatingSummaryResponse(Double averageStar,long totalRatings,long star5,long star4,long star3, long star2, long star1) {
        return RatingSummaryResponse.builder().averageStar(averageStar).totalRatings(totalRatings).star5(star5).star4(star4).star3(star3).star2(star2).star1(star1).build();
    }
}
