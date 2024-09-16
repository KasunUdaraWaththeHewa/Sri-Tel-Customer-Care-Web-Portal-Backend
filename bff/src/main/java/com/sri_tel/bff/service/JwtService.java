package com.sri_tel.bff.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


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
}