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
import java.time.temporal.ChronoUnit;
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
            // ================== TÀI KHOẢN ADMIN MẶC ĐỊNH ==================
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
                log.info("Đang khởi tạo dữ liệu mẫu đầy đủ cho toàn bộ hệ thống...");

                // ================== 1. USERS ==================
                // 3 tác giả (author) + 3 độc giả (reader) — tất cả role READER,
                // vì trong hệ thống, "tác giả" chỉ là user thường đã đăng sách lên (POST /books yêu cầu role READER).
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

                User author3 = User.builder()
                        .username("tranminhkhoi")
                        .password(passwordEncoder.encode("123456"))
                        .email("minhkhoi@booksocial.com")
                        .firstName("Minh Khôi")
                        .lastName("Trần")
                        .avatar("https://res.cloudinary.com/demo/image/upload/v1/author_minhkhoi.png")
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

                User reader3 = User.builder()
                        .username("thuy_duong")
                        .password(passwordEncoder.encode("123456"))
                        .email("duong.thuy@booksocial.com")
                        .firstName("Thùy Dương")
                        .lastName("Lê")
                        .avatar("https://res.cloudinary.com/demo/image/upload/v1/avatar_reader3.png")
                        .active(true)
                        .role(UserRole.READER)
                        .provider(AuthProvider.LOCAL)
                        .build();

                userRepository.saveAll(List.of(author1, author2, author3, reader1, reader2, reader3));

                // ================== 2. CATEGORIES ==================
                Category cat1 = Category.builder().name("Tiểu Thuyết").description("Các tác phẩm tiểu thuyết văn học sâu sắc").build();
                Category cat2 = Category.builder().name("Khoa Học Viễn Tưởng").description("Truyện khai thác đề tài tương lai, vũ trụ").build();
                Category cat3 = Category.builder().name("Trinh Thám").description("Những vụ án bí ẩn và hành trình phá án").build();
                Category cat4 = Category.builder().name("Kỹ Năng Sống").description("Sách hướng dẫn phát triển tư duy và bản thân").build();
                Category cat5 = Category.builder().name("Tình Cảm Tuổi Trẻ").description("Những câu chuyện học đường thơ mộng").build();
                Category cat6 = Category.builder().name("Kinh Dị").description("Những câu chuyện rùng rợn, ám ảnh").build();
                Category cat7 = Category.builder().name("Lịch Sử").description("Các tác phẩm khai thác đề tài lịch sử, triều đại").build();
                Category cat8 = Category.builder().name("Kinh Doanh").description("Sách về khởi nghiệp, quản trị, tài chính").build();
                Category cat9 = Category.builder().name("Thiếu Nhi").description("Truyện dành cho trẻ em và tuổi mới lớn").build();
                Category cat10 = Category.builder().name("Tâm Lý Học").description("Sách khám phá tâm lý, hành vi con người").build();

                categoryRepository.saveAll(List.of(cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8, cat9, cat10));

                // ================== 3. BOOKS ==================
                // --- Sách 1: Khoa học viễn tưởng, đã duyệt ---
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

                // --- Sách 2: Trinh thám, đã duyệt ---
                Book book2 = Book.builder()
                        .title("Bí Uẩn Đêm Mưa")
                        .description("Một vụ án mạng kỳ lạ xảy ra tại một thị trấn hẻo lánh.")
                        .coverImage("https://res.cloudinary.com/demo/image/upload/v1/detective_cover.jpg")
                        .language(BookLanguage.VIETNAMESE)
                        .totalChapters(3)
                        .viewCount(840)
                        .status(BookStatus.APPROVED)
                        .approvedAt(Instant.now())
                        .author(author2)
                        .categories(Set.of(cat1, cat3))
                        .build();

                // --- Sách 3: Tình cảm tuổi trẻ, đã duyệt ---
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

                // --- Sách 4: Kỹ năng sống, tiếng Anh, ĐANG CHỜ DUYỆT (PENDING) ---
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

                // --- Sách 5: Kinh dị, đã duyệt ---
                Book book5 = Book.builder()
                        .title("Ngôi Nhà Ma Ám")
                        .description("Gia đình nhỏ chuyển đến căn biệt thự cũ và những hiện tượng không thể lý giải bắt đầu xảy ra.")
                        .coverImage("https://res.cloudinary.com/demo/image/upload/v1/horror_cover.jpg")
                        .language(BookLanguage.VIETNAMESE)
                        .totalChapters(2)
                        .viewCount(560)
                        .status(BookStatus.APPROVED)
                        .approvedAt(Instant.now())
                        .author(author3)
                        .categories(Set.of(cat1, cat6))
                        .build();

                // --- Sách 6: Lịch sử, BỊ TỪ CHỐI (REJECTED) — để test luồng admin duyệt/từ chối sách ---
                Book book6 = Book.builder()
                        .title("Đế Chế Vàng Son")
                        .description("Góc nhìn hư cấu về một vương triều hưng thịnh rồi sụp đổ.")
                        .coverImage("https://res.cloudinary.com/demo/image/upload/v1/history_cover.jpg")
                        .language(BookLanguage.VIETNAMESE)
                        .totalChapters(1)
                        .viewCount(45)
                        .status(BookStatus.REJECTED)
                        .author(author3)
                        .categories(Set.of(cat7))
                        .build();

                // --- Sách 7: Kinh doanh, đã duyệt ---
                Book book7 = Book.builder()
                        .title("Khởi Nghiệp Từ Con Số 0")
                        .description("Hành trình xây dựng doanh nghiệp từ hai bàn tay trắng, đầy bài học thực chiến.")
                        .coverImage("https://res.cloudinary.com/demo/image/upload/v1/startup_cover.jpg")
                        .language(BookLanguage.VIETNAMESE)
                        .totalChapters(2)
                        .viewCount(980)
                        .status(BookStatus.APPROVED)
                        .approvedAt(Instant.now())
                        .author(author2)
                        .categories(Set.of(cat8))
                        .build();

                bookRepository.saveAll(List.of(book1, book2, book3, book4, book5, book6, book7));

                // ================== 4. CHAPTERS ==================
                // --- Sách 1: Hành Trình Vào Vũ Trụ (3 chương) ---
                Chapter b1_ch1 = Chapter.builder()
                        .chapterNumber(1).title("Chương 1: Khởi hành")
                        .content("Con tàu Hy Vọng rời bệ phóng lúc bình minh, mang theo năm phi hành gia trẻ tuổi " +
                                "hướng về phía rìa Hệ Mặt Trời. Thuyền trưởng Lâm kiểm tra lần cuối các thông số kỹ thuật " +
                                "trong khi kỹ sư Vy theo dõi lộ trình bay qua vành đai tiểu hành tinh. Không ai trong số họ " +
                                "biết rằng chuyến đi này sẽ thay đổi vĩnh viễn nhận thức của loài người về vũ trụ. " +
                                "Khi Trái Đất dần thu nhỏ thành một chấm xanh phía sau, cả phi hành đoàn im lặng, " +
                                "vừa háo hức vừa lo lắng cho những gì đang chờ đợi phía trước.")
                        .book(book1).build();

                Chapter b1_ch2 = Chapter.builder()
                        .chapterNumber(2).title("Chương 2: Tín hiệu lạ")
                        .content("Ba tuần sau khi rời Trái Đất, hệ thống radar của tàu Hy Vọng bắt được một tín hiệu " +
                                "bất thường phát ra từ khu vực gần Tinh Cầu X — một hành tinh chưa từng được ghi nhận " +
                                "trong bản đồ thiên văn. Kỹ sư Vy là người đầu tiên phát hiện ra tần số kỳ lạ này, " +
                                "lặp đi lặp lại theo một chu kỳ toán học chính xác đến kinh ngạc. Thuyền trưởng Lâm " +
                                "quyết định đổi hướng bay để điều tra, bất chấp sự phản đối của một số thành viên " +
                                "lo ngại về rủi ro chưa biết trước.")
                        .book(book1).build();

                Chapter b1_ch3 = Chapter.builder()
                        .chapterNumber(3).title("Chương 3: Căn cứ bỏ hoang")
                        .content("Khi tàu Hy Vọng hạ cánh xuống bề mặt Tinh Cầu X, phi hành đoàn phát hiện một căn cứ " +
                                "khổng lồ đã bị bỏ hoang từ lâu, với kiến trúc không giống bất kỳ nền văn minh nào " +
                                "loài người từng biết đến. Những bức tường phủ đầy ký hiệu phát sáng mờ ảo trong bóng tối, " +
                                "và ở trung tâm căn cứ là một cỗ máy khổng lồ vẫn đang hoạt động, chờ đợi một điều gì đó " +
                                "suốt hàng nghìn năm qua. Thuyền trưởng Lâm nhận ra: đây không phải một khám phá tình cờ.")
                        .book(book1).build();

                // --- Sách 2: Bí Uẩn Đêm Mưa (3 chương) ---
                Chapter b2_ch1 = Chapter.builder()
                        .chapterNumber(1).title("Chương 1: Tiếng động lúc nửa đêm")
                        .content("Mưa tầm tã rơi trên mái tôn thị trấn Sương Mù vào cái đêm ông Tư Phát được phát hiện " +
                                "đã chết trong căn nhà gỗ cuối con hẻm nhỏ. Cảnh sát trưởng Bình là người đầu tiên có mặt " +
                                "tại hiện trường, nơi mọi dấu vết dường như đã bị cơn mưa xóa sạch. Không có dấu hiệu đột " +
                                "nhập, cửa nẻo vẫn khóa kín từ bên trong — một vụ án mạng trong phòng kín kinh điển khiến " +
                                "cả thị trấn nhỏ chấn động.")
                        .book(book2).build();

                Chapter b2_ch2 = Chapter.builder()
                        .chapterNumber(2).title("Chương 2: Manh mối đầu tiên")
                        .content("Trong lúc khám nghiệm hiện trường, cảnh sát trưởng Bình tìm thấy một chiếc nhẫn bạc " +
                                "khắc chữ cái lạ nằm lăn lóc dưới gầm bàn — thứ duy nhất không thuộc về nạn nhân. " +
                                "Chiếc nhẫn này, theo lời kể của hàng xóm, từng thuộc về một người đàn ông lạ mặt đã " +
                                "ghé thăm ông Tư Phát vài lần trong tháng trước khi vụ án xảy ra. Manh mối mỏng manh " +
                                "nhưng đủ để mở ra một cuộc điều tra đầy bất ngờ.")
                        .book(book2).build();

                Chapter b2_ch3 = Chapter.builder()
                        .chapterNumber(3).title("Chương 3: Nhân chứng im lặng")
                        .content("Cảnh sát trưởng Bình lần theo dấu vết chiếc nhẫn và tìm đến quán cà phê nhỏ đầu phố, " +
                                "nơi một nhân chứng duy nhất từng nhìn thấy người đàn ông lạ mặt. Nhưng người này tỏ ra " +
                                "sợ hãi, từ chối hợp tác, như thể đang che giấu điều gì đó nguy hiểm hơn cả vụ án mạng. " +
                                "Bình nhận ra thị trấn nhỏ yên bình này đang giấu trong lòng nó một bí mật lớn hơn nhiều.")
                        .book(book2).build();

                // --- Sách 3: Nắng Hạ Năm Đó (2 chương) ---
                Chapter b3_ch1 = Chapter.builder()
                        .chapterNumber(1).title("Chương 1: Tiếng ve gọi hè")
                        .content("Mùa hè năm ấy thật dài, dài như những buổi chiều đạp xe cùng đám bạn dọc con đường " +
                                "rợp bóng phượng đỏ. An vẫn nhớ như in cái cảm giác gió lùa qua tóc và tiếng ve kêu " +
                                "râm ran khắp sân trường vắng lặng ngày hè. Đó cũng là mùa hè cô gặp Khang — cậu bạn " +
                                "mới chuyển đến, người đã âm thầm thay đổi cả những năm tháng thanh xuân của cô.")
                        .book(book3).build();

                Chapter b3_ch2 = Chapter.builder()
                        .chapterNumber(2).title("Chương 2: Lời hứa dưới tán phượng")
                        .content("Dưới gốc phượng già trong sân trường, Khang hứa với An rằng dù có đi đâu, cậu cũng " +
                                "sẽ quay lại vào đúng mùa hè năm sau. Lời hứa ấy trở thành ký ức đẹp nhất trong lòng An " +
                                "suốt những năm tháng xa cách, khi Khang phải chuyển theo gia đình sang một thành phố khác. " +
                                "Nhưng liệu một lời hứa tuổi mười bảy có đủ sức chống lại thời gian và khoảng cách?")
                        .book(book3).build();

                // --- Sách 4: The Mindset Shift (1 chương, tiếng Anh) ---
                Chapter b4_ch1 = Chapter.builder()
                        .chapterNumber(1).title("Chapter 1: The First Step")
                        .content("Every meaningful change begins with a single decision: the decision to see things " +
                                "differently. Most people wait for motivation before taking action, but successful " +
                                "people take action first and let motivation follow. This chapter explores the science " +
                                "behind habit formation and why your daily micro-decisions matter far more than " +
                                "occasional grand gestures of willpower.")
                        .book(book4).build();

                // --- Sách 5: Ngôi Nhà Ma Ám (2 chương) ---
                Chapter b5_ch1 = Chapter.builder()
                        .chapterNumber(1).title("Chương 1: Căn biệt thự cũ")
                        .content("Gia đình chị Hạnh chuyển đến căn biệt thự cổ nằm cuối con đường vắng vào một chiều " +
                                "thu se lạnh. Người môi giới nói rằng ngôi nhà đã bỏ trống hơn hai mươi năm vì không ai " +
                                "dám ở lại quá một tháng. Ngay đêm đầu tiên, cậu con trai nhỏ của chị đã thức giấc, " +
                                "khăng khăng rằng có ai đó đứng ở cuối giường nhìn mình suốt đêm.")
                        .book(book5).build();

                Chapter b5_ch2 = Chapter.builder()
                        .chapterNumber(2).title("Chương 2: Bức ảnh trong tầng hầm")
                        .content("Khi dọn dẹp tầng hầm, chị Hạnh tình cờ tìm thấy một bức ảnh gia đình cũ ố vàng, " +
                                "trong đó có một cô bé mặc váy trắng đứng lặng lẽ ở góc khung hình — gương mặt giống " +
                                "hệt những gì con trai chị đã mô tả. Càng tìm hiểu, chị càng nhận ra căn nhà này ẩn " +
                                "chứa một bi kịch chưa từng được kể lại, và có lẽ chính gia đình chị đang là một phần " +
                                "của câu chuyện đó.")
                        .book(book5).build();

                // --- Sách 6: Đế Chế Vàng Son (1 chương) ---
                Chapter b6_ch1 = Chapter.builder()
                        .chapterNumber(1).title("Chương 1: Buổi đăng quang")
                        .content("Dưới ánh đuốc rực sáng của đại điện, vị hoàng đế trẻ tuổi chính thức lên ngôi giữa " +
                                "sự hoan hô của bá quan văn võ. Không ai ngờ rằng chỉ vài năm sau, chính sự hoan hỉ " +
                                "ngày hôm ấy sẽ trở thành khởi đầu cho một chuỗi biến cố dẫn đến sự sụp đổ của cả một " +
                                "triều đại từng được xem là hùng mạnh nhất thời bấy giờ.")
                        .book(book6).build();

                // --- Sách 7: Khởi Nghiệp Từ Con Số 0 (2 chương) ---
                Chapter b7_ch1 = Chapter.builder()
                        .chapterNumber(1).title("Chương 1: Ý tưởng đầu tiên")
                        .content("Mọi thứ bắt đầu từ một chiếc bàn gỗ nhỏ trong gara và khoản vốn vỏn vẹn hai mươi " +
                                "triệu đồng vay từ mẹ. Tác giả kể lại những ngày đầu khởi nghiệp đầy chông gai, " +
                                "khi sản phẩm đầu tiên bị từ chối bởi gần như tất cả các nhà đầu tư tiềm năng. " +
                                "Nhưng chính sự kiên trì trong giai đoạn tưởng chừng vô vọng ấy đã đặt nền móng cho " +
                                "một doanh nghiệp triệu đô sau này.")
                        .book(book7).build();

                Chapter b7_ch2 = Chapter.builder()
                        .chapterNumber(2).title("Chương 2: Sai lầm đắt giá")
                        .content("Không phải mọi quyết định đều đúng đắn. Chương này kể về lần công ty suýt phá sản " +
                                "vì mở rộng quy mô quá nhanh mà chưa có hệ thống vận hành vững chắc. Tác giả chia sẻ " +
                                "thẳng thắn những bài học đắt giá về quản trị dòng tiền và tầm quan trọng của việc " +
                                "xây dựng đội ngũ đúng người, đúng thời điểm.")
                        .book(book7).build();

                chapterRepository.saveAll(List.of(
                        b1_ch1, b1_ch2, b1_ch3,
                        b2_ch1, b2_ch2, b2_ch3,
                        b3_ch1, b3_ch2,
                        b4_ch1,
                        b5_ch1, b5_ch2,
                        b6_ch1,
                        b7_ch1, b7_ch2
                ));

                // ================== 5. BOOKSHELVES ==================
                // Ràng buộc unique(user_id, book_id) — không được trùng cặp user + book
                Bookshelf shelf1 = Bookshelf.builder().user(reader1).book(book1).status(BookshelfStatus.READING).isFavorite(true).lastReadChapter(b1_ch2).build();
                Bookshelf shelf2 = Bookshelf.builder().user(reader1).book(book3).status(BookshelfStatus.COMPLETED).isFavorite(true).lastReadChapter(b3_ch2).build();
                Bookshelf shelf3 = Bookshelf.builder().user(reader1).book(book5).status(BookshelfStatus.READING).isFavorite(false).lastReadChapter(b5_ch1).build();

                Bookshelf shelf4 = Bookshelf.builder().user(reader2).book(book2).status(BookshelfStatus.READING).isFavorite(false).lastReadChapter(b2_ch1).build();
                Bookshelf shelf5 = Bookshelf.builder().user(reader2).book(book1).status(BookshelfStatus.COMPLETED).isFavorite(true).lastReadChapter(b1_ch3).build();

                Bookshelf shelf6 = Bookshelf.builder().user(reader3).book(book3).status(BookshelfStatus.READING).isFavorite(false).lastReadChapter(b3_ch1).build();
                Bookshelf shelf7 = Bookshelf.builder().user(reader3).book(book7).status(BookshelfStatus.READING).isFavorite(true).lastReadChapter(b7_ch1).build();

                bookshelfRepository.saveAll(List.of(shelf1, shelf2, shelf3, shelf4, shelf5, shelf6, shelf7));

                // ================== 6. RATINGS ==================
                // Ràng buộc unique(user_id, book_id) — mỗi user chỉ được đánh giá 1 sách một lần
                Rating r1 = Rating.builder().star(5).review("Sách khoa học viễn tưởng hay nhất mình từng đọc!").user(reader1).book(book1).build();
                Rating r2 = Rating.builder().star(4).review("Cốt truyện hấp dẫn nhưng kết thúc chương 2 hơi vội.").user(reader2).book(book1).build();
                Rating r3 = Rating.builder().star(5).review("Twist ở chương 3 quá đỉnh, không đoán được luôn.").user(reader3).book(book1).build();

                Rating r4 = Rating.builder().star(5).review("Rất xúc động, gợi nhớ nhiều kỷ niệm.").user(reader1).book(book3).build();
                Rating r5 = Rating.builder().star(4).review("Văn phong nhẹ nhàng, đọc rất cuốn.").user(reader3).book(book3).build();

                Rating r6 = Rating.builder().star(3).review("Ổn nhưng hơi chậm nhịp ở đầu truyện.").user(reader1).book(book5).build();
                Rating r7 = Rating.builder().star(5).review("Chi tiết bức ảnh trong tầng hầm làm mình nổi da gà.").user(reader2).book(book5).build();

                Rating r8 = Rating.builder().star(5).review("Nhiều bài học thực tế, rất đáng đọc cho ai mới khởi nghiệp.").user(reader3).book(book7).build();

                ratingRepository.saveAll(List.of(r1, r2, r3, r4, r5, r6, r7, r8));

                // ================== 7. COMMENTS (gồm cả bình luận trả lời — reply) ==================
                Comment c1 = Comment.builder().content("Tác giả viết đoạn này cuốn quá!").user(reader1).chapter(b1_ch1).build();
                commentRepository.save(c1);
                Comment c1_reply = Comment.builder().content("Cảm ơn bạn nhé, đọc tiếp chương 2 nha!").user(author1).chapter(b1_ch1).commentParent(c1).build();
                commentRepository.save(c1_reply);

                Comment c2 = Comment.builder().content("Đoạn tín hiệu lạ làm mình nổi da gà, căng thẳng thật sự.").user(reader2).chapter(b1_ch2).build();
                commentRepository.save(c2);

                Comment c3 = Comment.builder().content("Ai là hung thủ vậy nhỉ, tò mò quá.").user(reader2).chapter(b2_ch1).build();
                commentRepository.save(c3);
                Comment c3_reply = Comment.builder().content("Đọc tiếp chương 3 sẽ có thêm manh mối đó bạn ơi.").user(author2).chapter(b2_ch1).commentParent(c3).build();
                commentRepository.save(c3_reply);

                Comment c4 = Comment.builder().content("Chi tiết bức ảnh trong tầng hầm ám ảnh thật sự, đọc ban đêm sợ ghê.").user(reader1).chapter(b5_ch2).build();
                commentRepository.save(c4);

                Comment c5 = Comment.builder().content("Chương 1 rất truyền cảm hứng, mình cũng đang khởi nghiệp nên đồng cảm lắm.").user(reader3).chapter(b7_ch1).build();
                commentRepository.save(c5);
                Comment c5_reply = Comment.builder().content("Chúc bạn khởi nghiệp thành công nhé, cố lên!").user(author2).chapter(b7_ch1).commentParent(c5).build();
                commentRepository.save(c5_reply);

                // ================== 8. QUIZZES & QUESTIONS ==================
                // --- Quiz cho Chương 1 - Sách 1 (Hành Trình Vào Vũ Trụ) ---
                Quiz quiz1 = Quiz.builder().summary("Kiểm tra kiến thức Chương 1 - Khởi hành").chapter(b1_ch1).build();
                quizRepository.save(quiz1);

                Question q1_1 = Question.builder().content("Tên con tàu trong truyện là gì?").optionA("Hy Vọng").optionB("Bình Minh").optionC("Tự Do").optionD("Khám Phá").correctAnswer("A").quiz(quiz1).build();
                Question q1_2 = Question.builder().content("Ai là thuyền trưởng của con tàu?").optionA("Vy").optionB("Lâm").optionC("Bình").optionD("Khang").correctAnswer("B").quiz(quiz1).build();
                Question q1_3 = Question.builder().content("Con tàu rời Trái Đất vào thời điểm nào trong ngày?").optionA("Buổi trưa").optionB("Buổi tối").optionC("Bình minh").optionD("Nửa đêm").correctAnswer("C").quiz(quiz1).build();
                Question q1_4 = Question.builder().content("Con tàu bay qua khu vực nào trong Hệ Mặt Trời?").optionA("Vành đai tiểu hành tinh").optionB("Vành đai Kuiper").optionC("Sao Hỏa").optionD("Mặt Trăng").correctAnswer("A").quiz(quiz1).build();
                questionRepository.saveAll(List.of(q1_1, q1_2, q1_3, q1_4));

                // --- Quiz cho Chương 1 - Sách 2 (Bí Uẩn Đêm Mưa) ---
                Quiz quiz2 = Quiz.builder().summary("Kiểm tra kiến thức Chương 1 - Tiếng động lúc nửa đêm").chapter(b2_ch1).build();
                quizRepository.save(quiz2);

                Question q2_1 = Question.builder().content("Nạn nhân trong vụ án là ai?").optionA("Ông Tư Phát").optionB("Ông Bình").optionC("Bà Sáu").optionD("Anh Khang").correctAnswer("A").quiz(quiz2).build();
                Question q2_2 = Question.builder().content("Vụ án xảy ra ở thị trấn nào?").optionA("Sương Mù").optionB("Hoa Vàng").optionC("Bình Yên").optionD("Sông Xanh").correctAnswer("A").quiz(quiz2).build();
                Question q2_3 = Question.builder().content("Ai là người đầu tiên có mặt tại hiện trường?").optionA("Bác sĩ pháp y").optionB("Cảnh sát trưởng Bình").optionC("Hàng xóm").optionD("Người thân nạn nhân").correctAnswer("B").quiz(quiz2).build();
                Question q2_4 = Question.builder().content("Đặc điểm bất thường của hiện trường vụ án là gì?").optionA("Cửa mở toang").optionB("Có dấu chân lạ").optionC("Cửa khóa kín từ bên trong").optionD("Mất tài sản").correctAnswer("C").quiz(quiz2).build();
                questionRepository.saveAll(List.of(q2_1, q2_2, q2_3, q2_4));

                // --- Quiz cho Chương 1 - Sách 5 (Ngôi Nhà Ma Ám) ---
                Quiz quiz3 = Quiz.builder().summary("Kiểm tra kiến thức Chương 1 - Căn biệt thự cũ").chapter(b5_ch1).build();
                quizRepository.save(quiz3);

                Question q3_1 = Question.builder().content("Gia đình chị Hạnh chuyển đến nhà mới vào mùa nào?").optionA("Mùa xuân").optionB("Mùa hè").optionC("Mùa thu").optionD("Mùa đông").correctAnswer("C").quiz(quiz3).build();
                Question q3_2 = Question.builder().content("Ngôi biệt thự đã bỏ trống bao lâu?").optionA("5 năm").optionB("10 năm").optionC("Hơn 20 năm").optionD("2 năm").correctAnswer("C").quiz(quiz3).build();
                Question q3_3 = Question.builder().content("Ai là người thức giấc và nói có người đứng cuối giường?").optionA("Chị Hạnh").optionB("Con trai chị Hạnh").optionC("Chồng chị Hạnh").optionD("Người môi giới").correctAnswer("B").quiz(quiz3).build();
                Question q3_4 = Question.builder().content("Vì sao không ai dám ở lại căn nhà quá một tháng theo lời người môi giới?").optionA("Nhà quá cũ").optionB("Không có lý do rõ ràng, chỉ được ám chỉ là bất thường").optionC("Giá thuê quá cao").optionD("Không có điện nước").correctAnswer("B").quiz(quiz3).build();
                questionRepository.saveAll(List.of(q3_1, q3_2, q3_3, q3_4));

                // ================== 9. QUIZ ATTEMPTS & USER ANSWERS ==================
                // --- reader1 làm quiz1: đúng cả 4 câu -> 100 điểm ---
                QuizAttempt attempt1 = QuizAttempt.builder().score(100).submittedAt(Instant.now()).quiz(quiz1).user(reader1).build();
                quizAttemptRepository.save(attempt1);
                userAnswerRepository.saveAll(List.of(
                        UserAnswer.builder().selectedAnswer("A").isCorrect(true).question(q1_1).quizAttempt(attempt1).build(),
                        UserAnswer.builder().selectedAnswer("B").isCorrect(true).question(q1_2).quizAttempt(attempt1).build(),
                        UserAnswer.builder().selectedAnswer("C").isCorrect(true).question(q1_3).quizAttempt(attempt1).build(),
                        UserAnswer.builder().selectedAnswer("A").isCorrect(true).question(q1_4).quizAttempt(attempt1).build()
                ));

                // --- reader2 làm quiz1: đúng 2/4 câu -> 50 điểm ---
                QuizAttempt attempt2 = QuizAttempt.builder().score(50).submittedAt(Instant.now().minus(1, ChronoUnit.DAYS)).quiz(quiz1).user(reader2).build();
                quizAttemptRepository.save(attempt2);
                userAnswerRepository.saveAll(List.of(
                        UserAnswer.builder().selectedAnswer("A").isCorrect(true).question(q1_1).quizAttempt(attempt2).build(),
                        UserAnswer.builder().selectedAnswer("D").isCorrect(false).question(q1_2).quizAttempt(attempt2).build(),
                        UserAnswer.builder().selectedAnswer("C").isCorrect(true).question(q1_3).quizAttempt(attempt2).build(),
                        UserAnswer.builder().selectedAnswer("B").isCorrect(false).question(q1_4).quizAttempt(attempt2).build()
                ));

                // --- reader2 làm quiz2: đúng cả 4 câu -> 100 điểm ---
                QuizAttempt attempt3 = QuizAttempt.builder().score(100).submittedAt(Instant.now()).quiz(quiz2).user(reader2).build();
                quizAttemptRepository.save(attempt3);
                userAnswerRepository.saveAll(List.of(
                        UserAnswer.builder().selectedAnswer("A").isCorrect(true).question(q2_1).quizAttempt(attempt3).build(),
                        UserAnswer.builder().selectedAnswer("A").isCorrect(true).question(q2_2).quizAttempt(attempt3).build(),
                        UserAnswer.builder().selectedAnswer("B").isCorrect(true).question(q2_3).quizAttempt(attempt3).build(),
                        UserAnswer.builder().selectedAnswer("C").isCorrect(true).question(q2_4).quizAttempt(attempt3).build()
                ));

                // --- reader1 làm quiz3: đúng 3/4 câu -> 75 điểm ---
                QuizAttempt attempt4 = QuizAttempt.builder().score(75).submittedAt(Instant.now()).quiz(quiz3).user(reader1).build();
                quizAttemptRepository.save(attempt4);
                userAnswerRepository.saveAll(List.of(
                        UserAnswer.builder().selectedAnswer("C").isCorrect(true).question(q3_1).quizAttempt(attempt4).build(),
                        UserAnswer.builder().selectedAnswer("C").isCorrect(true).question(q3_2).quizAttempt(attempt4).build(),
                        UserAnswer.builder().selectedAnswer("B").isCorrect(true).question(q3_3).quizAttempt(attempt4).build(),
                        UserAnswer.builder().selectedAnswer("A").isCorrect(false).question(q3_4).quizAttempt(attempt4).build()
                ));

                // ================== 10. AI CHAT HISTORIES ==================
                // Lưu ý: entity AIChatHistory hiện yêu cầu chapter bắt buộc (nullable = false),
                // nên toàn bộ bản ghi mẫu dưới đây đều gắn với 1 chapter cụ thể.
                AIChatHistory ai1 = AIChatHistory.builder()
                        .question("Tóm tắt chương 1 giúp tôi?")
                        .answer("Chương 1 kể về việc phi hành đoàn tàu Hy Vọng rời Trái Đất vào lúc bình minh, " +
                                "do thuyền trưởng Lâm chỉ huy, hướng về rìa Hệ Mặt Trời.")
                        .sourceReference("Chương 1: Khởi hành")
                        .user(reader1)
                        .chapter(b1_ch1)
                        .book(book1)
                        .build();

                AIChatHistory ai2 = AIChatHistory.builder()
                        .question("Ai là người phát hiện ra tín hiệu lạ?")
                        .answer("Kỹ sư Vy là người đầu tiên phát hiện ra tần số tín hiệu bất thường phát ra từ khu vực " +
                                "gần Tinh Cầu X.")
                        .sourceReference("Chương 2: Tín hiệu lạ")
                        .user(reader1)
                        .chapter(b1_ch2)
                        .book(book1)
                        .build();

                AIChatHistory ai3 = AIChatHistory.builder()
                        .question("Chiếc nhẫn bạc có ý nghĩa gì trong vụ án?")
                        .answer("Chiếc nhẫn bạc khắc chữ cái lạ là manh mối duy nhất không thuộc về nạn nhân, " +
                                "được tìm thấy dưới gầm bàn, và từng thuộc về người đàn ông lạ mặt đã ghé thăm " +
                                "ông Tư Phát trước khi vụ án xảy ra.")
                        .sourceReference("Chương 2: Manh mối đầu tiên")
                        .user(reader2)
                        .chapter(b2_ch2)
                        .book(book2)
                        .build();

                AIChatHistory ai4 = AIChatHistory.builder()
                        .question("Cô bé trong bức ảnh cũ là ai?")
                        .answer("Nội dung chương chưa nêu rõ danh tính cô bé mặc váy trắng trong bức ảnh, " +
                                "chỉ biết gương mặt giống với những gì con trai chị Hạnh đã mô tả về hình bóng " +
                                "xuất hiện trong đêm.")
                        .sourceReference("Chương 2: Bức ảnh trong tầng hầm")
                        .user(reader1)
                        .chapter(b5_ch2)
                        .book(book5)
                        .build();

                aiChatHistoryRepository.saveAll(List.of(ai1, ai2, ai3, ai4));

                log.info("========== KHỞI TẠO DỮ LIỆU MẪU THÀNH CÔNG! ==========");
                log.info("Users: {} | Categories: {} | Books: {} | Chapters: {}",
                        userRepository.count(), categoryRepository.count(), bookRepository.count(), chapterRepository.count());
                log.info("Bookshelves: {} | Ratings: {} | Comments: {}",
                        bookshelfRepository.count(), ratingRepository.count(), commentRepository.count());
                log.info("Quizzes: {} | Questions: {} | QuizAttempts: {} | UserAnswers: {} | AIChatHistories: {}",
                        quizRepository.count(), questionRepository.count(), quizAttemptRepository.count(),
                        userAnswerRepository.count(), aiChatHistoryRepository.count());
            }

        });
    }

}