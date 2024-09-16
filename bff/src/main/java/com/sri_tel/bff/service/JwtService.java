package com.sri_tel.bff.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;


@Service
public class JwtService {

    @Value("${jwt.secret.key}")
    private String jwtSecretKey;

    public Claims validateJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecretKey.getBytes())
                .parseClaimsJws(token)
                .getBody();
    }

    // Method to extract all claims from the token
    public Map<String, Object> getClaimsFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecretKey)
                .parseClaimsJws(token)
                .getBody();
        return claims;
    }
}