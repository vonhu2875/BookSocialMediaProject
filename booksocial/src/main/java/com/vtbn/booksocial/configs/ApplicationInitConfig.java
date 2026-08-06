package com.vtbn.booksocial.configs;


import com.vtbn.booksocial.entities.User;
import com.vtbn.booksocial.enums.UserRole;
import com.vtbn.booksocial.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
//Dùng để ghi log
@Slf4j
public class ApplicationInitConfig {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

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
                        .build();

                userRepository.save(user);
                log.warn("admin được tạo với mật khẩu mặc định: admin@123, vui lòng thay đổi nó");
            }
            else {
                log.info("Tài khoản admin đã tồn tại");
            }
        });
    }

}


