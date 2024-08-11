package com.scms.products.security;

import com.scms.products.security.*;
import com.scms.products.dto.UserDto;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Base64;

public class AuthenticationFilter extends OncePerRequestFilter {
    private final RestTemplate restTemplate;
    private final EntryUserAuthenticationProvider entryUserAuthenticationProvider;

    public AuthenticationFilter(EntryUserAuthenticationProvider entryUserAuthenticationProvider) {
        this.restTemplate =new RestTemplate();
        this.entryUserAuthenticationProvider = entryUserAuthenticationProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            MultiValueMap<String, String> headers = new LinkedMultiValueMap<String, String>();
            headers.add(HttpHeaders.AUTHORIZATION, request.getHeader("Authorization"));
            HttpEntity<?> httpEntity = new HttpEntity<Object>(headers);
            ResponseEntity<UserDto> responseEntity = restTemplate.exchange("http://localhost:8080/authentication/authenticate?key=" + new String(Base64.getDecoder().decode(SecurityConstants.API_KEY)), HttpMethod.GET, httpEntity, UserDto.class);
            if (responseEntity.getStatusCode().isSameCodeAs(HttpStatus.OK)) {
                SecurityContextHolder.getContext().setAuthentication(entryUserAuthenticationProvider.authenticate(new EntryUserAuthenticationToken(responseEntity.getBody(), null)));
                filterChain.doFilter(request, response);
            } else {
                throw new Exception("Authentication failed.");
            }
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            response.setStatus(HttpStatus.FORBIDDEN.value());
        }
    }
}
