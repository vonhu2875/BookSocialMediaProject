package com.vtbn.booksocial.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;
    @Value("${jwt.expiration}")
    private long jwtExpiration;

//    Sinh ra một JWT (JSON Web Token) sau khi người dùng đăng nhập thành công.
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .id(UUID.randomUUID().toString())
                .issuer("BookSocial")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignKey())
                .compact();
    }
//    Là hàm dùng chung để lấy bất kỳ thông tin (Claim) nào trong JWT.
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

//    Lấy username từ JWT.
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

//Lấy JWT ID (jti) từ token.
    public String extractTokenId(String token){
        return extractClaim(token, Claims::getId);
    }

//    Lấy thông tin Issuer (hệ thống phát hành token).
    public String extractIssuer(String token){
        return extractClaim(token, Claims::getIssuer);
    }
//Lấy thời điểm hết hạn của JWT.
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
//Kiểm tra JWT đã hết hạn hay chưa.
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
//Kiểm tra JWT có hợp lệ hay không.s
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
//    Giải mã JWT và lấy toàn bộ thông tin (Claims) bên trong.
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

//Tạo khóa bí mật (SecretKey) từ giá trị jwt.secret trong file cấu hình.
    private SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
                java.util.Base64.getEncoder().encodeToString(secretKey.getBytes())
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }
}