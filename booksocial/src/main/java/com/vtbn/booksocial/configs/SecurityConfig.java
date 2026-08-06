package com.vtbn.booksocial.configs;

import com.vtbn.booksocial.security.JwtAuthenticationFilter;
import com.vtbn.booksocial.services.impl.CustomUserDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailService customUserDetailService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customUserDetailService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    //Nhận username và password từ client gửi lên sau đó kiểm tra xem, nếu đúng thì trả về đối tượng authentication chưa user và role
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // Tắt CSRF
                .csrf(AbstractHttpConfigurer::disable)

                // Tắt Form Login mặc định của Spring Security
                .formLogin(AbstractHttpConfigurer::disable)

                // Tắt HTTP Basic Authentication
                .httpBasic(AbstractHttpConfigurer::disable)

                // Khai báo AuthenticationProvider
                .authenticationProvider(authenticationProvider())

                // Không sử dụng Session
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Phân quyền API
                .authorizeHttpRequests(auth -> auth

                        // Cho phép tất cả request OPTIONS (phục vụ CORS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Cho phép truy cập các API Authentication
                        .requestMatchers(
                                "/error",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/users", "/categories").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/categories").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("ADMIN")
                        // Các API còn lại phải đăng nhập
                        .anyRequest().authenticated()
                )
                // Thêm JWT Filter vào trước Filter mặc định của Spring Security
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}