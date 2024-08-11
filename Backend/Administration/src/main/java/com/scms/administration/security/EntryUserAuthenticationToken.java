package com.scms.administration.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class EntryUserAuthenticationToken extends UsernamePasswordAuthenticationToken {
    public EntryUserAuthenticationToken(String principal, String credentials) {
        super(principal, credentials);
    }

    public EntryUserAuthenticationToken(EntryUserDetails principal, String credentials, Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
    }
}
