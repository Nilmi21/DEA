package com.scms.administration.service;

import com.scms.administration.dto.*;
import com.scms.administration.model.Role;
import com.scms.administration.model.User;
import com.scms.administration.repository.RoleRepository;
import com.scms.administration.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.xml.crypto.Data;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hibernate.validator.internal.util.Contracts.assertTrue;

@Service
public class UsersService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public UsersService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public ListUsersResponse listUsers() {
        try {
            List<UserDto> users = new ArrayList<>();
            for(User user : userRepository.findAll()) {
                users.add(new UserDto(user.getUserId(), user.getUsername(), user.getRole().getRoleId()));
            }
            List<DataReferenceElement> roles = new ArrayList<>();
            for(Role role : roleRepository.findAll()) {
                roles.add(new DataReferenceElement(role.getRoleId(), role.getRoleDescription()));
            }
            return new ListUsersResponse(roles, users);
        }
        catch (Exception e) {
            return new ListUsersResponse(new ArrayList<>(), new ArrayList<>());
        }
    }

    public List<DataReferenceElement> listUsersForDataReference() {
        try {
            List<DataReferenceElement> users = new ArrayList<>();
            for(User user : userRepository.findAll()) {
                users.add(new DataReferenceElement(user.getUserId(), user.getUsername()));
            }
            return users;
        }
        catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public FormSubmitResponse addUser(String username, String password, Long roleId) {
        try {
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = passwordEncoder.encode(password);

            Optional<Role> result = roleRepository.findById(roleId);
            assertTrue(result.isPresent(), "Failed to retrieve role.");
            Role role = result.get();

            User insertingUser = new User();
            insertingUser.setUsername(username);
            insertingUser.setPassword(encodedPassword);
            insertingUser.setRole(role);
            userRepository.save(insertingUser);
            return new FormSubmitResponse(new Message(true, "User successfully added."), null);
        }
        catch(Exception e) {
            return new FormSubmitResponse(new Message(false, "Failed to add user."), null);
        }
    }

    public FormSubmitResponse editUser(Long userId, String username, Long roleId) {
        try {
            Optional<Role> roleResult = roleRepository.findById(roleId);
            assertTrue(roleResult.isPresent(), "Failed to retrieve role.");
            Role role = roleResult.get();

            Optional<User> result = userRepository.findById(userId);
            assertTrue(result.isPresent(), "Failed to retrieve user.");
            User user = result.get();
            user.setUsername(username);
            user.setRole(role);

            userRepository.save(user);
            return new FormSubmitResponse(new Message(true, "User successfully updated."), null);
        }
        catch(Exception e) {
            return new FormSubmitResponse(new Message(false, "Failed to update user."), null);
        }
    }

    public FormSubmitResponse deleteUser(Long userId) {
        try {
            Optional<User> result = userRepository.findById(userId);
            assertTrue(result.isPresent(), "Failed to retrieve user.");
            User user = result.get();
            userRepository.delete(user);
            return new FormSubmitResponse(new Message(true, "User successfully deleted."), null);
        }
        catch (Exception e) {
            return new FormSubmitResponse(new Message(false, "Failed to update user."), null);
        }
    }

}
