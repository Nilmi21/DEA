package com.scms.administration.security;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.filter.OncePerRequestFilter;
import com.scms.administration.dto.Error;

import java.io.IOException;
import java.util.Date;

import static com.scms.administration.security.SecurityConstants.JWT_SECRET;
import static com.scms.administration.security.SecurityConstants.JWT_EXPIRATION;

public class EntryUserFilter extends OncePerRequestFilter {
    private final EntryUserAuthenticationProvider entryUserAuthenticationProvider;

    public EntryUserFilter(EntryUserAuthenticationProvider entryUserAuthenticationProvider) {
        this.entryUserAuthenticationProvider = entryUserAuthenticationProvider;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            if(!request.getMethod().equals("POST")) {
                throw new HttpRequestMethodNotSupportedException("Only supports POST requests.");
            }
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            Authentication authentication = new EntryUserAuthenticationToken(username, password);
            Authentication authenticatedUser = entryUserAuthenticationProvider.authenticate(authentication);
            EntryUserDetails entryUserDetails = (EntryUserDetails) authenticatedUser.getPrincipal();
            long jwt_expiration = JWT_EXPIRATION * 60000;
            Date currentDate = new Date();
            Date expirationDate = new Date(currentDate.getTime() + jwt_expiration);
            String token = Jwts
                    .builder()
                    .subject(authenticatedUser.getName())
                    .issuedAt(currentDate)
                    .expiration(expirationDate)
                    .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(JWT_SECRET)))
                    .compact();
            entryUserDetails.setToken(token);
            SecurityContextHolder.getContext().setAuthentication(authenticatedUser);
            filterChain.doFilter(request, response);
        }
        catch(UsernameNotFoundException e) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            Error error = new Error("username", e.getMessage());
            ObjectMapper objectMapper = new ObjectMapper();
            String errorResponseString = objectMapper.writeValueAsString(error);
            response.getWriter().write(errorResponseString);
            response.getWriter().flush();
        }
        catch(BadCredentialsException e) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            Error error = new Error("password", e.getMessage());
            ObjectMapper objectMapper = new ObjectMapper();
            String errorResponseString = objectMapper.writeValueAsString(error);
            response.getWriter().write(errorResponseString);
            response.getWriter().flush();
        }
        catch(Exception e) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            Error error = new Error("unknown", e.getMessage());
            ObjectMapper objectMapper = new ObjectMapper();
            String errorResponseString = objectMapper.writeValueAsString(error);
            response.getWriter().write(errorResponseString);
            response.getWriter().flush();
        }
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        return !(request.getServletPath().equals("/authentication/login"));
    }
}
