package com.scms.products.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class EntryUserAuthenticationToken extends UsernamePasswordAuthenticationToken {
    public EntryUserAuthenticationToken() {
        super(null, null);
    }
    public EntryUserAuthenticationToken(Object principal, Object credentials) {
        super(principal, credentials);
    }

    public EntryUserAuthenticationToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
    }
}
