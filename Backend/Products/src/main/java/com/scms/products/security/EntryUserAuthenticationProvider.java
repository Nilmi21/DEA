package com.scms.products.security;

import com.scms.products.dto.UserDto;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class EntryUserAuthenticationProvider implements AuthenticationProvider {
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if(authentication != null && authentication.getPrincipal() != null) {
            UserDto userDto = (UserDto) authentication.getPrincipal();
            List<SimpleGrantedAuthority> grantedAuthorities = new ArrayList<>();
            grantedAuthorities.add(new SimpleGrantedAuthority(String.valueOf(userDto.getRoleId())));
            return new EntryUserAuthenticationToken(userDto, userDto.getUserId(), grantedAuthorities);
        }
        throw new AuthenticationServiceException("Failed to get proper authentication details.");
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
