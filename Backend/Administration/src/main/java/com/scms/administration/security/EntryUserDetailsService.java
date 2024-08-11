package com.scms.administration.security;

import com.scms.administration.model.User;
import com.scms.administration.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class EntryUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public EntryUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        EntryUserDetails entryUserDetails;
        try {
            User user = userRepository.findUserByUsername(username);
            entryUserDetails = new EntryUserDetails(user);
            return entryUserDetails;
        }
        catch (Exception e) {
            throw new UsernameNotFoundException("The username is not recognized.");
        }
    }
}
