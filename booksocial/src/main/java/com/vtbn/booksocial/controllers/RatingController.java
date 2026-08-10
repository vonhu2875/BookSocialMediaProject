package com.vtbn.booksocial.controllers;

import com.vtbn.booksocial.dto.request.RatingRequest;
import com.vtbn.booksocial.dto.response.ApiResponse;
import com.vtbn.booksocial.dto.response.RatingDetailResponse;
import com.vtbn.booksocial.services.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ratings")
@RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;

    @PutMapping("/{ratingId}")
    public ApiResponse<RatingDetailResponse> updateRating(Authentication authentication,@PathVariable int ratingId,@Valid @RequestBody RatingRequest request) {
        RatingDetailResponse ratingDetailResponse = ratingService.updateRating(authentication,ratingId,request);
        return ApiResponse.<RatingDetailResponse>builder().result(ratingDetailResponse).build();
    }

    @DeleteMapping("/{ratingId}")
    public ApiResponse<Void> deleteRating(Authentication authentication,@PathVariable int ratingId) {
        ratingService.deleteRating(authentication,ratingId);
        return ApiResponse.<Void>builder().message("Delete rating success").build();
    }
}
