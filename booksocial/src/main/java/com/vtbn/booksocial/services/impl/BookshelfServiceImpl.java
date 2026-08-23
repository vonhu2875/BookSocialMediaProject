package com.vtbn.booksocial.services.impl;

import com.vtbn.booksocial.dto.request.ReadingProgressRequest;
import com.vtbn.booksocial.dto.response.BookshelfResponse;
import com.vtbn.booksocial.entities.Book;
import com.vtbn.booksocial.entities.Bookshelf;
import com.vtbn.booksocial.entities.Chapter;
import com.vtbn.booksocial.entities.User;
import com.vtbn.booksocial.enums.BookshelfStatus;
import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.mappers.BookshelfMapper;
import com.vtbn.booksocial.repositories.BookRepository;
import com.vtbn.booksocial.repositories.BookshelfRepository;
import com.vtbn.booksocial.repositories.ChapterRepository;
import com.vtbn.booksocial.repositories.UserRepository;
import com.vtbn.booksocial.services.BookshelfService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookshelfServiceImpl implements BookshelfService {
    private final BookshelfRepository bookshelfRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookshelfMapper bookshelfMapper;
    private final ChapterRepository chapterRepository;
    @Override
    public BookshelfResponse addToBookshelf(Authentication authentication, int bookId) {
        // 1. Lấy user đang đăng nhập
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

        // 3. Kiểm tra user đã thêm sách này chưa
        if (bookshelfRepository.existsByUserIdAndBookId(user.getId(),bookId)) {
            throw new AppException(ErrorCode.BOOK_ALREADY_IN_BOOKSHELF);
        }

        // 4. Tạo Bookshelf
        Bookshelf bookshelf = Bookshelf.builder().user(user).book(book).status(BookshelfStatus.READING).isFavorite(false).lastReadChapter(null).build();

        // 5. Lưu database
        Bookshelf savedBookshelf = bookshelfRepository.save(bookshelf);

        // 6. Entity → Response
        return bookshelfMapper.toBookshelfResponse(savedBookshelf);
    }

    @Override
    public void deleteBookshelf(Authentication authentication, int bookId) {
        // 1. Lấy user hiện tại
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        // 2. Tìm sách trong tủ sách của user
        Bookshelf bookshelf =
                bookshelfRepository.findByUserIdAndBookId(
                        user.getId(),
                        bookId
                );

        // 3. Nếu chưa có trong tủ sách
        if (bookshelf == null) {
            throw new AppException(
                    ErrorCode.BOOK_NOT_IN_BOOKSHELF
            );
        }

        // 4. Xóa khỏi tủ sách
        bookshelfRepository.delete(bookshelf);
    }

    @Override
    public List<BookshelfResponse> getMyBookshelf(Authentication authentication) {
        // 1. Lấy user hiện tại
        String username = authentication.getName();

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        // 2. Lấy danh sách sách trong bookshelf
        List<Bookshelf> bookshelfs =
                bookshelfRepository.findByUserId(user.getId());

        // 3. Entity → Response
        return bookshelfs.stream()
                .map(bookshelfMapper::toBookshelfResponse)
                .toList();
    }

    @Override
    @Transactional
    public void updateReadingProgress(Authentication authentication, int bookId, ReadingProgressRequest request) {
        // 1. Lấy user hiện tại
        String username = authentication.getName();

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        // 2. Tìm bookshelf của user với book này
        Bookshelf bookshelf =
                bookshelfRepository.findByUserIdAndBookId(
                        user.getId(),
                        bookId
                );

        if (bookshelf == null) {
            Book book = bookRepository.findById(bookId);

            if (book == null) {
                throw new AppException(ErrorCode.BOOK_NOT_FOUND);
            }
            bookshelf = Bookshelf.builder().user(user).book(book).status(BookshelfStatus.READING).isFavorite(false).lastReadChapter(null).build();
            // 5. Lưu database
            bookshelfRepository.save(bookshelf);
        }

        // 3. Tìm chapter
        Chapter chapter =
                chapterRepository.findById(
                        request.getChapterId()
                );

        if (chapter == null) {
            throw new AppException(
                    ErrorCode.CHAPTER_NOT_FOUND
            );
        }

        // 4. Kiểm tra chapter có thuộc book không
        if (chapter.getBook().getId() != bookId) {
            throw new AppException(
                    ErrorCode.CHAPTER_NOT_IN_BOOK
            );
        }

        // 5. Cập nhật chapter cuối cùng đã đọc
        bookshelf.setLastReadChapter(chapter);

        // 6. Tìm chapter cuối cùng của book
        Chapter lastChapter =
                chapterRepository.findTopByBookIdOrderByChapterNumberDesc(
                        bookId
                );

        if (lastChapter == null) {
            throw new AppException(
                    ErrorCode.CHAPTER_NOT_FOUND
            );
        }

        // 7. Cập nhật trạng thái
        if (chapter.getId() == lastChapter.getId()) {

            bookshelf.setStatus(BookshelfStatus.COMPLETED);

        } else if (bookshelf.getStatus() != BookshelfStatus.COMPLETED) {
            bookshelf.setStatus(BookshelfStatus.READING);
        }

        // 8. Lưu bookshelf
        bookshelfRepository.save(bookshelf);
    }
}
