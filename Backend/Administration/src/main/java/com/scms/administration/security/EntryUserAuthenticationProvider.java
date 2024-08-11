package com.scms.administration.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class EntryUserAuthenticationProvider implements AuthenticationProvider {

    private final EntryUserDetailsService entryUserDetailsService;

    @Autowired
    public EntryUserAuthenticationProvider(EntryUserDetailsService entryUserDetailsService) {
        this.entryUserDetailsService = entryUserDetailsService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        EntryUserDetails entryUserDetails = (EntryUserDetails) entryUserDetailsService.loadUserByUsername(authentication.getPrincipal().toString());
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if(passwordEncoder.matches(authentication.getCredentials().toString(), entryUserDetails.getPassword())) {
            return new EntryUserAuthenticationToken(entryUserDetails, entryUserDetails.getPassword(), entryUserDetails.getAuthorities());
        }
        else {
            throw new BadCredentialsException("Your password is incorrect.");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return EntryUserAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
