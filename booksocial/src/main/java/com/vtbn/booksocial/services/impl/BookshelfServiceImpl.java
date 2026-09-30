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
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        Book book = bookRepository.findById(bookId);

        if (book == null) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }
        if (bookshelfRepository.existsByUserIdAndBookId(user.getId(),bookId)) {
            throw new AppException(ErrorCode.BOOK_ALREADY_IN_BOOKSHELF);
        }

        Bookshelf bookshelf = Bookshelf.builder().user(user).book(book).status(BookshelfStatus.READING).isFavorite(false).lastReadChapter(null).build();
        Bookshelf savedBookshelf = bookshelfRepository.save(bookshelf);
        return bookshelfMapper.toBookshelfResponse(savedBookshelf);
    }

    @Override
    public void deleteBookshelf(Authentication authentication, int bookId) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        Bookshelf bookshelf =
                bookshelfRepository.findByUserIdAndBookId(
                        user.getId(),
                        bookId
                );

        if (bookshelf == null) {
            throw new AppException(
                    ErrorCode.BOOK_NOT_IN_BOOKSHELF
            );
        }

        bookshelfRepository.delete(bookshelf);
    }

    @Override
    public List<BookshelfResponse> getMyBookshelf(Authentication authentication) {
        String username = authentication.getName();

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        List<Bookshelf> bookshelfs =
                bookshelfRepository.findByUserId(user.getId());

        return bookshelfs.stream()
                .map(bookshelfMapper::toBookshelfResponse)
                .toList();
    }

    @Override
    @Transactional
    public void updateReadingProgress(Authentication authentication, int bookId, ReadingProgressRequest request) {
        String username = authentication.getName();

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

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
            bookshelfRepository.save(bookshelf);
        }

        Chapter chapter =
                chapterRepository.findById(
                        request.getChapterId()
                );

        if (chapter == null) {
            throw new AppException(
                    ErrorCode.CHAPTER_NOT_FOUND
            );
        }

        if (chapter.getBook().getId() != bookId) {
            throw new AppException(
                    ErrorCode.CHAPTER_NOT_IN_BOOK
            );
        }

        bookshelf.setLastReadChapter(chapter);
        Chapter lastChapter =
                chapterRepository.findTopByBookIdOrderByChapterNumberDesc(
                        bookId
                );

        if (lastChapter == null) {
            throw new AppException(
                    ErrorCode.CHAPTER_NOT_FOUND
            );
        }
        if (chapter.getId() == lastChapter.getId()) {

            bookshelf.setStatus(BookshelfStatus.COMPLETED);

        } else if (bookshelf.getStatus() != BookshelfStatus.COMPLETED) {
            bookshelf.setStatus(BookshelfStatus.READING);
        }
        bookshelfRepository.save(bookshelf);
    }

    @Override
    public void addBookFavorite(Authentication authentication, int bookId) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        Book book = bookRepository.findById(bookId);
        if (book == null) {
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        }
        Bookshelf bookshelf = bookshelfRepository.findByUserIdAndBookId(user.getId(),bookId);
        if (bookshelf != null) {
            bookshelf.setFavorite(!bookshelf.isFavorite());
        }
        else
            bookshelf = Bookshelf.builder().user(user).book(book).status(BookshelfStatus.READING).isFavorite(false).lastReadChapter(null).build();
        bookshelfRepository.save(bookshelf);
    }

    @Override
    public List<BookshelfResponse> getMyFavoriteBookshelf(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        List<Bookshelf> favoriteBookshelfs = bookshelfRepository.findByUserIdAndIsFavoriteTrue(user.getId());

        return favoriteBookshelfs.stream()
                .map(bookshelfMapper::toBookshelfResponse)
                .toList();
    }
}
