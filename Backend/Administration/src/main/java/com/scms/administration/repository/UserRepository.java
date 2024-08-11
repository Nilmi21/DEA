package com.scms.administration.repository;

import com.scms.administration.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
    public User findUserByUsername(String username);
}
