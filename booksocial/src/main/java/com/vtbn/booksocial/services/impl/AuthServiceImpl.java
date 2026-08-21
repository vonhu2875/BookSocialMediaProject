package com.vtbn.booksocial.services.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.vtbn.booksocial.dto.request.GoogleLoginRequest;
import com.vtbn.booksocial.dto.request.LoginRequest;
import com.vtbn.booksocial.dto.request.RegisterRequest;
import com.vtbn.booksocial.dto.response.LoginResponse;
import com.vtbn.booksocial.dto.response.UserResponse;
import com.vtbn.booksocial.entities.InvalidatedToken;
import com.vtbn.booksocial.entities.User;
import com.vtbn.booksocial.enums.AuthProvider;
import com.vtbn.booksocial.enums.UserRole;
import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.mappers.UserMapper;
import com.vtbn.booksocial.repositories.InvalidatedTokenRepository;
import com.vtbn.booksocial.repositories.UserRepository;
import com.vtbn.booksocial.security.JwtService;
import com.vtbn.booksocial.services.AuthService;
import com.vtbn.booksocial.services.UserService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
//@RequiredArgsConstructor của Lombok giúp tự sinh Constructor cho các field final (hoặc @NonNull).
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final InvalidatedTokenRepository invalidatedTokenRepository;
    private final CustomUserDetailService customUserDetailService;
    @Value("${google.client.id}")
    private String googleClientId;
    @Override
    public UserResponse register(RegisterRequest request) {

        if(userRepository.existsByUsername(request.getUsername())){
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }

        if(userRepository.existsByEmail(request.getEmail())){
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole(UserRole.READER);
        user.setActive(true);
        user.setProvider(AuthProvider.LOCAL);

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        UserDetails userDetails = (UserDetails)authentication.getPrincipal();
        if(userDetails == null)
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        String token = jwtService.generateToken(userDetails);

        User user = userRepository.findByUsername(request.getUsername());
        UserResponse userResponse = userMapper.toResponse(user);

        return LoginResponse.builder().token(token).tokenType("Bearer").user(userResponse).build();
    }

    @Override
    public void logout(String authHeader) {
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
        String token = authHeader.substring(7);
        Claims claims = jwtService.extractAllClaims(token);
        InvalidatedToken invalidatedToken = InvalidatedToken.builder().id(claims.getId()).expiryTime(claims.getExpiration().toInstant()).build();
        invalidatedTokenRepository.save(invalidatedToken);
    }

    @Override
    public LoginResponse googleLogin(GoogleLoginRequest request) {
        try {
            // 1. Khởi tạo Google Verifier với Client ID
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            // 2. Kiểm tra tính hợp lệ của Token gửi từ Frontend
            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            if (idToken == null) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            // 3. Trích xuất thông tin User từ Google Payload
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");
            String pictureUrl = (String) payload.get("picture");

            // 4. Tìm kiếm User theo Email trong Database
            User user = userRepository.findByEmail(email);

            // 5. Nếu chưa có -> Tạo tài khoản mới (Auto-register)
            if (user == null) {
                String baseUsername = email.split("@")[0];
                String username = baseUsername;
                int count = 1;
                while (userRepository.existsByUsername(username)) {
                    username = baseUsername + count++;
                }

                user = User.builder()
                        .username(username)
                        .email(email)
                        .firstName(firstName)
                        .lastName(lastName)
                        .avatar(pictureUrl)
                        .active(true)
                        .role(UserRole.READER)
                        .provider(AuthProvider.GOOGLE)
                        .build();

                user = userRepository.save(user);
            }

            // 6. Tạo UserDetails chuẩn từ CustomUserDetailService của dự án
            UserDetails userDetails = customUserDetailService.loadUserByUsername(user.getUsername());

            // 7. Sinh JWT Token bằng JwtService của dự án
            String token = jwtService.generateToken(userDetails);

            // 8. Map thông tin User sang UserResponse
            UserResponse userResponse = userMapper.toResponse(user);

            // 9. Trả về LoginResponse đồng bộ hoàn toàn với hàm login() thường
            return LoginResponse.builder()
                    .token(token)
                    .tokenType("Bearer")
                    .user(userResponse)
                    .build();

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }
}
