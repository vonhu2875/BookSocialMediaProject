package com.vtbn.booksocial.services;

import com.vtbn.booksocial.dto.request.RatingRequest;
import com.vtbn.booksocial.dto.response.RatingDetailResponse;
import com.vtbn.booksocial.dto.response.RatingListResponse;
import com.vtbn.booksocial.dto.response.RatingSummaryResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface RatingService {
    RatingDetailResponse createRating(Authentication authentication,int bookId,RatingRequest request);
    List<RatingListResponse> getRatingsByBook(int bookId);
    RatingDetailResponse getMyRating(Authentication authentication,int bookId);
    RatingDetailResponse updateRating(Authentication authentication,int ratingId,RatingRequest request);
    void deleteRating(Authentication authentication,int ratingId);
    RatingSummaryResponse getRatingSummary(int bookId);
}
