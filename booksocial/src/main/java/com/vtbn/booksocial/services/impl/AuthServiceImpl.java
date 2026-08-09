package com.vtbn.booksocial.services.impl;

import com.vtbn.booksocial.dto.request.LoginRequest;
import com.vtbn.booksocial.dto.request.RegisterRequest;
import com.vtbn.booksocial.dto.response.LoginResponse;
import com.vtbn.booksocial.dto.response.UserResponse;
import com.vtbn.booksocial.entities.InvalidatedToken;
import com.vtbn.booksocial.entities.User;
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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
//@RequiredArgsConstructor của Lombok giúp tự sinh Constructor cho các field final (hoặc @NonNull).
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final UserService userService;

    private final InvalidatedTokenRepository invalidatedTokenRepository;

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
}
