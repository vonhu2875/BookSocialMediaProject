package com.vtbn.booksocial.services.impl;

import com.vtbn.booksocial.dto.request.BookRequest;
import com.vtbn.booksocial.dto.response.BookDetailResponse;
import com.vtbn.booksocial.dto.response.BookListResponse;
import com.vtbn.booksocial.entities.Book;
import com.vtbn.booksocial.entities.Category;
import com.vtbn.booksocial.entities.User;
import com.vtbn.booksocial.enums.BookStatus;
import com.vtbn.booksocial.enums.UserRole;
import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.mappers.BookMapper;
import com.vtbn.booksocial.repositories.BookRepository;
import com.vtbn.booksocial.repositories.CategoryRepository;
import com.vtbn.booksocial.repositories.UserRepository;
import com.vtbn.booksocial.services.BookService;
import com.vtbn.booksocial.services.CloudinaryService;
import com.vtbn.booksocial.specifications.BookSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private final UserRepository userRepository;
    private final BookMapper bookMapper;
    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;
    private final BookRepository bookRepository;

    @Override
    public BookListResponse createBook(Authentication authentication, BookRequest request) {
        String username = authentication.getName();
        if (bookRepository.existsByTitleAndAuthor_Username(request.getTitle(),username)) {
            throw new AppException(ErrorCode.BOOK_ALREADY_EXISTS);
        }
        User user = userRepository.findByUsername(username);
        if(user == null)
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        Book book = bookMapper.toBook(request);
        book.setAuthor(user);
        book.setStatus(BookStatus.PENDING);

        if(request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
            if(categories.size() != request.getCategoryIds().size())
                throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);

            book.setCategories(new HashSet<>(categories));
        }

        MultipartFile coverImg = request.getCoverImage();

        if(coverImg != null && !coverImg.isEmpty()) {
            String coverImage = cloudinaryService.uploadFile(coverImg, "booksocial/cover-image");
            book.setCoverImage(coverImage);
        }
        bookRepository.save(book);
        return bookMapper.toBookListResponse(book);
    }

    @Override
    public Page<BookListResponse> getBooks(List<Integer> categoryIds, int authorId, String keyword, Pageable pageable) {
        Specification<Book> specification =Specification
                        .where(BookSpecification.hasStatus(BookStatus.APPROVED))
                        .and(BookSpecification.hasCategories(categoryIds))
                        .and(BookSpecification.hasAuthor(authorId))
                        .and(BookSpecification.containsKeyword(keyword));

        Page<Book> books = bookRepository.findAll(specification,pageable);
        return books.map(bookMapper::toBookListResponse);
    }

    @Override
    public BookDetailResponse getBook(int id) {
        Book book = bookRepository.findById(id);
        if(book==null)
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);

        return bookMapper.toBookDetailResponse(book);
    }

    @Override
    public BookDetailResponse updateBook(Authentication authentication, int id, BookRequest request) {
        String username = authentication.getName();

        Book book = bookRepository.findById(id);
        if(book == null)
            throw  new AppException(ErrorCode.BOOK_NOT_FOUND);
        if(!book.getAuthor().getUsername().equals(username))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        if(!book.getTitle().equals(request.getTitle()) && bookRepository.existsByTitleAndAuthor_Username(request.getTitle(), username))
            throw new AppException(ErrorCode.BOOK_ALREADY_EXISTS);

        book.setTitle(request.getTitle());
        book.setDescription(request.getDescription());
        book.setLanguage(request.getLanguage());

        if(request.getCategoryIds() != null) {
            List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
            if(categories.size() != request.getCategoryIds().size())
                throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
            book.setCategories(new HashSet<>(categories));
        }
        MultipartFile coverImg = request.getCoverImage();
        if(coverImg != null && !coverImg.isEmpty()) {
            String coverImage = cloudinaryService.uploadFile(coverImg, "booksocial/cover-image");
            book.setCoverImage(coverImage);
        }
        book.setStatus(BookStatus.PENDING);
        book.setApprovedAt(null);
        bookRepository.save(book);
        return bookMapper.toBookDetailResponse(book);
    }

    @Override
    public void deleteBook(Authentication authentication, int id) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        Book book = bookRepository.findById(id);
        if (book == null) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }
        boolean isAdmin = user.getRole() == UserRole.ADMIN;
        boolean isAuthor = book.getAuthor().getUsername().equals(username);
        if (!isAdmin && !isAuthor) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        bookRepository.delete(book);
    }

    @Override
    public Page<BookDetailResponse> getMyBooks(Authentication authentication, Pageable pageable) {
        String username = authentication.getName();
        Page<Book> books = bookRepository.findAllByAuthor_Username(username,pageable);
        return books.map(bookMapper::toBookDetailResponse);
    }

    @Override
    public Page<BookListResponse> getPendingBooks(Pageable pageable) {
        Page<Book> books =bookRepository.findAllByStatus(BookStatus.PENDING,pageable);
        return books.map(bookMapper::toBookListResponse);
    }

    @Override
    public void approveBook(int id) {
        Book book = bookRepository.findById(id);
        if(book == null)
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        if(book.getStatus() != BookStatus.PENDING)
            throw new AppException(ErrorCode.INVALID_BOOK_STATUS);
        book.setStatus(BookStatus.APPROVED);
        book.setApprovedAt(Instant.now());
        bookRepository.save(book);
    }

    @Override
    public void rejectBook(int id) {
        Book book = bookRepository.findById(id);
        if(book == null)
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        if(book.getStatus() != BookStatus.PENDING)
            throw new AppException(ErrorCode.INVALID_BOOK_STATUS);
        book.setStatus(BookStatus.REJECTED);
        book.setApprovedAt(null);

        bookRepository.save(book);
    }

    @Override
    public void increaseViewCount(int id) {
        Book book = bookRepository.findById(id);
        if (book == null) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }
        book.setViewCount(book.getViewCount() + 1);
        bookRepository.save(book);
    }

}
