package com.scms.administration.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scms.administration.dto.RequireAuthResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static com.scms.administration.security.SecurityConstants.JWT_SECRET;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final EntryUserDetailsService entryUserDetailsService;

    public JwtAuthenticationFilter(EntryUserDetailsService entryUserDetailsService) {
        this.entryUserDetailsService = entryUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if(StringUtils.hasText(token)) {
                    Claims claims = Jwts.parser()
                            .verifyWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(JWT_SECRET)))
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();
                    String username = claims.getSubject();
                    if(StringUtils.hasText(username)) {
                        if(!request.getServletPath().equals("/authentication/requireauth")) {
                            EntryUserDetails userDetails = (EntryUserDetails) entryUserDetailsService
                                    .loadUserByUsername(username);
                            SecurityContextHolder.getContext()
                                    .setAuthentication(new EntryUserAuthenticationToken(
                                            userDetails,
                                            userDetails.getPassword(),
                                            userDetails.getAuthorities()
                                    ));
                        }
                        filterChain.doFilter(request, response);
                    }
                    else {
                        throw new BadCredentialsException("Credentials absent from token.");
                    }
                }
                else {
                    throw new BadCredentialsException("Token not found.");
                }
            }
            else {
                throw new BadCredentialsException("Invalid authentication scheme.");
            }
        }
        catch(Exception e) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            if(request.getServletPath().equals("/authentication/requireauth")) {
                ObjectMapper objectMapper = new ObjectMapper();
                String requireAuthResponseString = objectMapper.writeValueAsString(new RequireAuthResponse(false));
                response.getWriter().write(requireAuthResponseString);
                response.getWriter().flush();
            }
            //Add message
        }
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        return (request.getServletPath().equals("/authentication/login"));
    }
}
