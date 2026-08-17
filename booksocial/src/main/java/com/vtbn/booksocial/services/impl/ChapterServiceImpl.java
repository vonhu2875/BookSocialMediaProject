package com.vtbn.booksocial.services.impl;

import com.vtbn.booksocial.dto.request.ChapterRequest;
import com.vtbn.booksocial.dto.response.ChapterDetailResponse;
import com.vtbn.booksocial.dto.response.ChapterListResponse;
import com.vtbn.booksocial.dto.response.ChapterSummaryResponse;
import com.vtbn.booksocial.entities.Book;
import com.vtbn.booksocial.entities.Bookshelf;
import com.vtbn.booksocial.entities.Chapter;
import com.vtbn.booksocial.entities.User;
import com.vtbn.booksocial.enums.UserRole;
import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.mappers.ChapterMapper;
import com.vtbn.booksocial.repositories.BookRepository;
import com.vtbn.booksocial.repositories.BookshelfRepository;
import com.vtbn.booksocial.repositories.ChapterRepository;
import com.vtbn.booksocial.repositories.UserRepository;
import com.vtbn.booksocial.services.AIService;
import com.vtbn.booksocial.services.ChapterFileService;
import com.vtbn.booksocial.services.ChapterService;
import com.vtbn.booksocial.services.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChapterServiceImpl implements ChapterService {
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final ChapterRepository chapterRepository;
    private final ChapterMapper chapterMapper;
    private final ChapterFileService chapterFileService;
    private final CloudinaryService cloudinaryService;
    private final BookshelfRepository bookshelfRepository;
    private final AIService aiService;
    @Override
//    Nếu Chapter save thành công nhưng Book update thất bại thì transaction sẽ rollback.
    @Transactional
    public ChapterDetailResponse createChapter(Authentication authentication, int bookId, ChapterRequest request) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if(user == null)
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        Book book = bookRepository.findById(bookId);
        if(book == null)
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        boolean isAdmin = user.getRole() == UserRole.ADMIN;
        boolean isAuthor = book.getAuthor().getUsername().equals(username);

        if(!isAdmin && !isAuthor)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        if(request.getChapterNumber() <= 0)
            throw new AppException(ErrorCode.CHAPTER_NUMBER_INVALID);

        if(chapterRepository.existsByBookIdAndChapterNumber(bookId, request.getChapterNumber()))
            throw new AppException(ErrorCode.CHAPTER_ALREADY_EXISTS);

        if(request.getFile() == null || request.getFile().isEmpty())
            throw new AppException(ErrorCode.CHAPTER_FILE_REQUIRED);

        String content = chapterFileService.extractText(request.getFile());

        if(content == null || content.isBlank()) {
            throw new AppException(ErrorCode.CHAPTER_CONTENT_EMPTY);
        }

        String fileUrl = cloudinaryService.uploadFile(request.getFile(),"booksocial/chapters");
        Chapter chapter = chapterMapper.toChapter(request);
        chapter.setBook(book);
        chapter.setContent(content);
        chapter.setFileUrl(fileUrl);
        chapterRepository.save(chapter);
        book.setTotalChapters(book.getTotalChapters() + 1);
        bookRepository.save(book);
        return chapterMapper.toChapterDetailResponse(chapter);
    }

    @Override
    public Page<ChapterListResponse> getChapters(int bookId, Pageable pageable) {
        Book book = bookRepository.findById(bookId);
        if(book == null)
            throw new AppException(ErrorCode.BOOK_NOT_FOUND);
        Page<Chapter> chapters = chapterRepository.findByBookId(bookId, pageable);
        return chapters.map(chapterMapper::toChapterListResponse);
    }

    @Override
    public ChapterDetailResponse getChapter(int chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId);
        if(chapter == null)
            throw new AppException(ErrorCode.CHAPTER_NOT_FOUND);
        return chapterMapper.toChapterDetailResponse(chapter);
    }

    @Override
    @Transactional
    public ChapterDetailResponse updateChapter(Authentication authentication, int chapterId, ChapterRequest request) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if (user == null)
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        Chapter chapter = chapterRepository.findById(chapterId);
        if (chapter == null)
            throw new AppException(ErrorCode.CHAPTER_NOT_FOUND);
        Book book = chapter.getBook();
        boolean isAdmin = user.getRole() == UserRole.ADMIN;
        boolean isAuthor = book.getAuthor().getUsername().equals(username);
        if (!isAdmin && !isAuthor)
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        if (request.getChapterNumber() <= 0)
            throw new AppException(ErrorCode.CHAPTER_NUMBER_INVALID);
        if (chapterRepository.existsByBookIdAndChapterNumberAndIdNot(book.getId(),request.getChapterNumber(),chapterId)) {
            throw new AppException(ErrorCode.CHAPTER_ALREADY_EXISTS);
        }
        chapter.setChapterNumber(request.getChapterNumber());
        chapter.setTitle(request.getTitle());
        if (request.getFile() != null && !request.getFile().isEmpty()) {
            String content = chapterFileService.extractText(request.getFile());
            if (content == null || content.isBlank())
                throw new AppException(ErrorCode.CHAPTER_CONTENT_EMPTY);
            String fileUrl = cloudinaryService.uploadFile(request.getFile(),"booksocial/chapters");
            chapter.setContent(content);
            chapter.setFileUrl(fileUrl);
            // Content đã thay đổi, summary cũ không còn chính xác
            chapter.setSummary(null);
        }
        chapterRepository.save(chapter);
        return chapterMapper.toChapterDetailResponse(chapter);
    }

    @Override
    @Transactional
    public void deleteChapter(Authentication authentication, int chapterId) {
        String username = authentication.getName();

        // 1. Tìm chapter
        Chapter chapter = chapterRepository.findById(chapterId);

        if (chapter == null) {
            throw new AppException(ErrorCode.CHAPTER_NOT_FOUND);
        }

        // 2. Tìm user đang đăng nhập
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        // 3. Kiểm tra quyền
        boolean isAdmin = user.getRole() == UserRole.ADMIN;

        boolean isAuthor =
                chapter.getBook()
                        .getAuthor()
                        .getUsername()
                        .equals(username);

        if (!isAdmin && !isAuthor) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // 4. Lưu thông tin file trước khi xóa chapter
        String fileUrl = chapter.getFileUrl();

        // 5. Xóa reference chapter khỏi Bookshelf
        List<Bookshelf> bookshelves =
                bookshelfRepository.findAllByLastReadChapter_Id(chapterId);

        for (Bookshelf bookshelf : bookshelves) {
            bookshelf.setLastReadChapter(null);
        }

        bookshelfRepository.saveAll(bookshelves);

        // 6. Giảm tổng số chapter của Book
        Book book = chapter.getBook();

        if (book.getTotalChapters() > 0) {
            book.setTotalChapters(book.getTotalChapters() - 1);
        }

        bookRepository.save(book);

        // 7. Xóa chapter
        chapterRepository.delete(chapter);

        // 8. Xóa file trên Cloudinary
        if (fileUrl != null && !fileUrl.isBlank()) {
            cloudinaryService.deleteFile(fileUrl);
        }
    }


    @Override
    @Transactional
    public ChapterSummaryResponse summaryChapter(Authentication authentication, int chapterId) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        Chapter chapter = chapterRepository.findById(chapterId);

        if (chapter == null)
            throw new AppException(ErrorCode.CHAPTER_NOT_FOUND);
        if (chapter.getContent() == null || chapter.getContent().isBlank())
            throw new AppException(ErrorCode.CHAPTER_CONTENT_EMPTY);
        // Nếu chapter đã có summary thì sử dụng lại
        if (chapter.getSummary() != null && !chapter.getSummary().isBlank()) {
            return chapterMapper.toChapterSummaryResponse(chapter);
        }
        String summary = aiService.summaryChapter(chapter.getContent());

        if (summary == null || summary.isBlank()) {
            throw new AppException(ErrorCode.CHAPTER_SUMMARY_GENERATION_FAILED);
        }

        chapter.setSummary(summary);

        chapterRepository.save(chapter);

        return chapterMapper.toChapterSummaryResponse(chapter);
    }
}
