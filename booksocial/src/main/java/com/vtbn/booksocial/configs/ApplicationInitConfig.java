package com.vtbn.booksocial.configs;


import com.vtbn.booksocial.entities.*;
import com.vtbn.booksocial.enums.*;
import com.vtbn.booksocial.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
//Dùng để ghi log
@Slf4j
public class ApplicationInitConfig {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final ChapterRepository chapterRepository;
    private final BookshelfRepository bookshelfRepository;
    private final RatingRepository ratingRepository;
    private final CommentRepository commentRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final UserAnswerRepository userAnswerRepository;
    private final AIChatHistoryRepository aiChatHistoryRepository;
    private static final String ADMIN_USER_NAME = "admin";
    private static final String ADMIN_PASSWORD = "admin@123";

    @Bean
    ApplicationRunner applicationRunner(){
        return(args -> {
            if(userRepository.findByUsername(ADMIN_USER_NAME) == null){
                User user = User.builder()
                        .username(ADMIN_USER_NAME)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .role(UserRole.ADMIN)
                        .firstName("Vo")
                        .lastName("Nhu")
                        .email("vonhu2875@gmail.com")
                        .active(true)
                        .provider(AuthProvider.LOCAL)
                        .build();

                userRepository.save(user);
                log.warn("admin được tạo với mật khẩu mặc định: admin@123, vui lòng thay đổi nó");
            }
            else {
                log.info("Tài khoản admin đã tồn tại");
            }

            if (categoryRepository.count() == 0) {
                log.info("Đang khởi tạo danh sách dữ liệu mẫu đa dạng...");

                // --- USERS ---
                User author1 = User.builder()
                        .username("nguyennhatanh")
                        .password(passwordEncoder.encode("123456"))
                        .email("nhatanh@booksocial.com")
                        .firstName("Nhật Ánh")
                        .lastName("Nguyễn")
                        .avatar("https://res.cloudinary.com/demo/image/upload/v1/author_nhatanh.png")
                        .active(true)
                        .role(UserRole.READER)
                        .provider(AuthProvider.LOCAL)
                        .build();

                User author2 = User.builder()
                        .username("dothi")
                        .password(passwordEncoder.encode("123456"))
                        .email("dothi@booksocial.com")
                        .firstName("Thị")
                        .lastName("Đỗ")
                        .avatar("https://res.cloudinary.com/demo/image/upload/v1/author_dothi.png")
                        .active(true)
                        .role(UserRole.READER)
                        .provider(AuthProvider.LOCAL)
                        .build();

                User reader1 = User.builder()
                        .username("docgia_lan")
                        .password(passwordEncoder.encode("123456"))
                        .email("lan.docgia@booksocial.com")
                        .firstName("Lan")
                        .lastName("Trần")
                        .avatar("https://res.cloudinary.com/demo/image/upload/v1/avatar_reader1.png")
                        .active(true)
                        .role(UserRole.READER)
                        .provider(AuthProvider.LOCAL)
                        .build();

                User reader2 = User.builder()
                        .username("hoang_nam")
                        .password(passwordEncoder.encode("123456"))
                        .email("nam.hoang@booksocial.com")
                        .firstName("Nam")
                        .lastName("Hoàng")
                        .avatar("https://res.cloudinary.com/demo/image/upload/v1/avatar_reader2.png")
                        .active(true)
                        .role(UserRole.READER)
                        .provider(AuthProvider.LOCAL)
                        .build();

                userRepository.saveAll(List.of(author1, author2, reader1, reader2));

                // --- CATEGORIES ---
                Category cat1 = Category.builder().name("Tiểu Thuyết").description("Các tác phẩm tiểu thuyết văn học sâu sắc").build();
                Category cat2 = Category.builder().name("Khoa Học Viễn Tưởng").description("Truyện khai thác đề tài tương lai, vũ trụ").build();
                Category cat3 = Category.builder().name("Trinh Thám").description("Những vụ án bí ẩn và hành trình phá án").build();
                Category cat4 = Category.builder().name("Kỹ Năng Sống").description("Sách hướng dẫn phát triển tư duy và bản thân").build();
                Category cat5 = Category.builder().name("Tình Cảm Tuổi Trẻ").description("Những câu chuyện học đường thơ mộng").build();

                categoryRepository.saveAll(List.of(cat1, cat2, cat3, cat4, cat5));

                // --- BOOKS ---
                Book book1 = Book.builder()
                        .title("Hành Trình Vào Vũ Trụ")
                        .description("Chuyến phiêu lưu vượt qua các thiên hà của nhóm phi hành gia trẻ.")
                        .coverImage("https://res.cloudinary.com/demo/image/upload/v1/space_cover.jpg")
                        .language(BookLanguage.VIETNAMESE)
                        .totalChapters(3)
                        .viewCount(1250)
                        .status(BookStatus.APPROVED)
                        .approvedAt(Instant.now())
                        .author(author1)
                        .categories(Set.of(cat1, cat2))

                        .build();

                Book book2 = Book.builder()
                        .title("Bí Uẩn Đêm Mưa")
                        .description("Một vụ án mạng kỳ lạ xảy ra tại một thị trấn hẻo lánh.")
                        .coverImage("https://res.cloudinary.com/demo/image/upload/v1/detective_cover.jpg")
                        .language(BookLanguage.VIETNAMESE)
                        .totalChapters(2)
                        .viewCount(840)
                        .status(BookStatus.APPROVED)
                        .approvedAt(Instant.now())
                        .author(author2)
                        .categories(Set.of(cat1, cat3))
                        .build();

                Book book3 = Book.builder()
                        .title("Nắng Hạ Năm Đó")
                        .description("Ký ức đẹp đẽ về tình bạn và những ước mơ thời trung học.")
                        .coverImage("https://res.cloudinary.com/demo/image/upload/v1/summer_cover.jpg")
                        .language(BookLanguage.VIETNAMESE)
                        .totalChapters(2)
                        .viewCount(2100)
                        .status(BookStatus.APPROVED)
                        .approvedAt(Instant.now())
                        .author(author1)
                        .categories(Set.of(cat1, cat5))
                        .build();

                Book book4 = Book.builder()
                        .title("The Mindset Shift")
                        .description("A comprehensive guide to changing your daily habits and perspective.")
                        .coverImage("https://res.cloudinary.com/demo/image/upload/v1/english_book.jpg")
                        .language(BookLanguage.ENGLISH)
                        .totalChapters(1)
                        .viewCount(310)
                        .status(BookStatus.PENDING)
                        .author(author2)
                        .categories(Set.of(cat4))
                        .build();

                bookRepository.saveAll(List.of(book1, book2, book3, book4));

                // --- CHAPTERS ---
                Chapter b1_ch1 = Chapter.builder().chapterNumber(1).title("Chương 1: Khởi hành").content("Nội dung chương 1: Con tàu rời Trái Đất...").book(book1).build();
                Chapter b1_ch2 = Chapter.builder().chapterNumber(2).title("Chương 2: Tín hiệu lạ").content("Nội dung chương 2: Tín hiệu phát ra từ Tinh cầu X...").book(book1).build();
                Chapter b1_ch3 = Chapter.builder().chapterNumber(3).title("Chương 3: Căn cứ bỏ hoang").content("Nội dung chương 3: Đặt chân lên hành tinh mới...").book(book1).build();

                Chapter b2_ch1 = Chapter.builder().chapterNumber(1).title("Chương 1: Tiếng động lúc nửa đêm").content("Mưa tầm tã rơi trên mái tôn...").book(book2).build();
                Chapter b2_ch2 = Chapter.builder().chapterNumber(2).title("Chương 2: Manh mối đầu tiên").content("Chiếc nhẫn bạc bỏ lại hiện trường...").book(book2).build();

                Chapter b3_ch1 = Chapter.builder().chapterNumber(1).title("Chương 1: Tiếng ve gọi hè").content("Mùa hè năm ấy thật dài...").book(book3).build();

                chapterRepository.saveAll(List.of(b1_ch1, b1_ch2, b1_ch3, b2_ch1, b2_ch2, b3_ch1));

                // --- BOOKSHELVES ---
                Bookshelf shelf1 = Bookshelf.builder().user(reader1).book(book1).status(BookshelfStatus.READING).isFavorite(true).lastReadChapter(b1_ch2).build();
                Bookshelf shelf2 = Bookshelf.builder().user(reader1).book(book3).status(BookshelfStatus.COMPLETED).isFavorite(true).lastReadChapter(b3_ch1).build();
                Bookshelf shelf3 = Bookshelf.builder().user(reader2).book(book2).status(BookshelfStatus.READING).isFavorite(false).lastReadChapter(b2_ch1).build();

                bookshelfRepository.saveAll(List.of(shelf1, shelf2, shelf3));

                // --- RATINGS ---
                Rating r1 = Rating.builder().star(5).review("Sách khoa học viễn tưởng hay nhất mình từng đọc!").user(reader1).book(book1).build();
                Rating r2 = Rating.builder().star(4).review("Cốt truyện hấp dẫn nhưng kết thúc chương 2 hơi vội.").user(reader2).book(book1).build();
                Rating r3 = Rating.builder().star(5).review("Rất xúc động, gợi nhớ nhiều kỷ niệm.").user(reader1).book(book3).build();

                ratingRepository.saveAll(List.of(r1, r2, r3));

                // --- COMMENTS ---
                Comment c1 = Comment.builder().content("Tác giả viết đoạn này cuốn quá!").user(reader1).chapter(b1_ch1).build();
                commentRepository.save(c1);

                Comment c1_reply = Comment.builder().content("Cảm ơn bạn nhé, đọc tiếp chương 2 nha!").user(author1).chapter(b1_ch1).commentParent(c1).build();
                commentRepository.save(c1_reply);

                Comment c2 = Comment.builder().content("Ai là hung thủ vậy nhỉ, tò mò quá.").user(reader2).chapter(b2_ch1).build();
                commentRepository.save(c2);

                // --- QUIZZES & QUESTIONS ---
                Quiz quiz1 = Quiz.builder().summary("Kiểm tra kiến thức Chương 1 - Vũ Trụ").chapter(b1_ch1).build();
                quizRepository.save(quiz1);

                Question q1 = Question.builder().content("Con tàu rời Trái Đất vào thời gian nào?").optionA("Buổi sáng").optionB("Buổi trưa").optionC("Buổi tối").optionD("Nửa đêm").correctAnswer("A").quiz(quiz1).build();
                Question q2 = Question.builder().content("Ai phát hiện ra tín hiệu lạ?").optionA("Thuyền trưởng").optionB("Kỹ sư").optionC("Bác sĩ").optionD("Nhà khoa học").correctAnswer("B").quiz(quiz1).build();
                questionRepository.saveAll(List.of(q1, q2));

                // --- QUIZ ATTEMPTS & ANSWERS ---
                QuizAttempt attempt1 = QuizAttempt.builder().score(100).submittedAt(Instant.now()).quiz(quiz1).user(reader1).build();
                quizAttemptRepository.save(attempt1);

                UserAnswer ua1 = UserAnswer.builder().selectedAnswer("A").isCorrect(true).question(q1).quizAttempt(attempt1).build();
                UserAnswer ua2 = UserAnswer.builder().selectedAnswer("B").isCorrect(true).question(q2).quizAttempt(attempt1).build();
                userAnswerRepository.saveAll(List.of(ua1, ua2));

                // --- AI CHAT HISTORIES ---
                AIChatHistory ai1 = AIChatHistory.builder()
                        .question("Tóm tắt chương 1 giúp tôi?")
                        .answer("Chương 1 nói về việc phi hành đoàn bắt đầu rời Trái Đất...")
                        .sourceReference("Chương 1: Khởi hành")
                        .user(reader1)
                        .chapter(b1_ch1)
                        .book(book1)
                        .build();

                AIChatHistory ai2 = AIChatHistory.builder()
                        .question("Chiếc nhẫn bạc có ý nghĩa gì?")
                        .answer("Chiếc nhẫn bạc là manh mối duy nhất thu thuộc về nghi phạm...")
                        .sourceReference("Chương 2: Manh mối đầu tiên")
                        .user(reader2)
                        .chapter(b2_ch2)
                        .book(book2)
                        .build();

                aiChatHistoryRepository.saveAll(List.of(ai1, ai2));

                log.info("========== KHOI TAO DU LIEU THANH CONG! ==========");
            }

        });
    }

}


