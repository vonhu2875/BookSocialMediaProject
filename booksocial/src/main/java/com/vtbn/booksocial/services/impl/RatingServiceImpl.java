package com.vtbn.booksocial.services.impl;

import com.vtbn.booksocial.dto.request.RatingRequest;
import com.vtbn.booksocial.dto.response.RatingDetailResponse;
import com.vtbn.booksocial.dto.response.RatingListResponse;
import com.vtbn.booksocial.dto.response.RatingSummaryResponse;
import com.vtbn.booksocial.entities.Book;
import com.vtbn.booksocial.entities.Rating;
import com.vtbn.booksocial.entities.User;
import com.vtbn.booksocial.enums.BookStatus;
import com.vtbn.booksocial.enums.UserRole;
import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.mappers.RatingMapper;
import com.vtbn.booksocial.repositories.BookRepository;
import com.vtbn.booksocial.repositories.RatingRepository;
import com.vtbn.booksocial.repositories.UserRepository;
import com.vtbn.booksocial.services.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final RatingMapper ratingMapper;


    @Override
    public RatingDetailResponse createRating(
            Authentication authentication,
            int bookId,
            RatingRequest request
    ) {

        // 1. Lấy user hiện tại
        String username = authentication.getName();

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        // 2. Kiểm tra book
        Book book = bookRepository.findById(bookId);

        if (book == null) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }
        //Kiểm tra trạng thái
        if (book.getStatus() != BookStatus.APPROVED) {
            throw new AppException(ErrorCode.INVALID_BOOK_STATUS);
        }
        // 3. Kiểm tra user đã rating book này chưa
        if (ratingRepository.existsByBookIdAndUserId(
                bookId,
                user.getId()
        )) {
            throw new AppException(ErrorCode.RATING_ALREADY_EXISTS);
        }

        // 4. Convert request -> entity
        Rating rating = ratingMapper.toRating(request);


        // 5. Gán quan hệ
        rating.setUser(user);
        rating.setBook(book);


        // 6. Lưu database
        ratingRepository.save(rating);


        // 7. Convert entity -> response
        return ratingMapper.toRatingDetailResponse(rating);
    }


    @Override
    public List<RatingListResponse> getRatingsByBook(int bookId) {

        // Kiểm tra book
        Book book = bookRepository.findById(bookId);

        if (book == null) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }


        // Lấy rating
        List<Rating> ratings =
                ratingRepository.findByBookIdOrderByCreatedDateDesc(bookId);


        // Convert
        return ratings.stream()
                .map(ratingMapper::toRatingListResponse)
                .toList();
    }


    @Override
    public RatingDetailResponse getMyRating(
            Authentication authentication,
            int bookId
    ) {

        // User hiện tại
        String username = authentication.getName();

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }


        // Kiểm tra book
        Book book = bookRepository.findById(bookId);

        if (book == null) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }


        // Tìm rating của user
        Rating rating =
                ratingRepository.findByBookIdAndUserId(
                        bookId,
                        user.getId()
                );

        if (rating == null) {
            throw new AppException(ErrorCode.RATING_NOT_FOUND);
        }


        return ratingMapper.toRatingDetailResponse(rating);
    }


    @Override
    public RatingDetailResponse updateRating(
            Authentication authentication,
            int ratingId,
            RatingRequest request
    ) {

        // User hiện tại
        String username = authentication.getName();

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }


        // Tìm rating
        Rating rating = ratingRepository.findById(ratingId);

        if (rating == null) {
            throw new AppException(ErrorCode.RATING_NOT_FOUND);
        }


        // Chỉ owner mới được sửa
        if (rating.getUser().getId() != user.getId()) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }


        // Update
        rating.setStar(request.getStar());
        rating.setReview(request.getReview());


        // Save
        rating = ratingRepository.save(rating);


        return ratingMapper.toRatingDetailResponse(rating);
    }


    @Override
    public void deleteRating(Authentication authentication,int ratingId) {
        // User hiện tại
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        // Tìm rating
        Rating rating = ratingRepository.findById(ratingId);
        if (rating == null) {
            throw new AppException(ErrorCode.RATING_NOT_FOUND);
        }
        // Kiểm tra quyền
        boolean isOwner = rating.getUser().getId() == user.getId();
        boolean isAdmin = user.getRole() == UserRole.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }
        ratingRepository.delete(rating);
    }

    @Override
    public RatingSummaryResponse getRatingSummary(int bookId) {
        // Kiểm tra book tồn tại
        Book book = bookRepository.findById(bookId);
        if (book == null) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }
        Double averageStar = ratingRepository.getAverageStar(bookId);
        long totalRatings = ratingRepository.countByBookId(bookId);
        long star5 = ratingRepository.countByBookIdAndStar(bookId, 5);
        long star4 = ratingRepository.countByBookIdAndStar(bookId, 4);
        long star3 = ratingRepository.countByBookIdAndStar(bookId, 3);
        long star2 = ratingRepository.countByBookIdAndStar(bookId, 2);
        long star1 = ratingRepository.countByBookIdAndStar(bookId, 1);
        double average = averageStar != null? Math.round(averageStar * 100.0) / 100.0: 0.0;
        return ratingMapper.toRatingSummaryResponse(average, totalRatings, star5, star4, star3, star2, star1);
    }
}
