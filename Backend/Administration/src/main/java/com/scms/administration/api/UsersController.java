package com.scms.administration.api;

import com.scms.administration.dto.DataReferenceElement;
import com.scms.administration.dto.FormSubmitResponse;
import com.scms.administration.dto.ListUsersResponse;
import com.scms.administration.service.UsersService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UsersController {

    public final UsersService usersService;

    @Autowired
    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @GetMapping("listusers")
    public ResponseEntity<ListUsersResponse> listUsersHandler() {
        ListUsersResponse listUsersResponse = usersService.listUsers();
        return new ResponseEntity<>(listUsersResponse, HttpStatus.OK);
    }

    @GetMapping("listusersfordatareference")
    public ResponseEntity<List<DataReferenceElement>> listUsersForDataReferenceHandler() {
        List<DataReferenceElement> users = usersService.listUsersForDataReference();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PostMapping("adduser")
    public ResponseEntity<FormSubmitResponse> addUserHandler(
            @RequestParam("username") @NotBlank String username,
            @RequestParam("password") @NotBlank String password,
            @RequestParam("roleId") @NotBlank String roleId
    ) {
        FormSubmitResponse formSubmitResponse = usersService.addUser(username, password, Long.parseLong(roleId));
        return new ResponseEntity<>(formSubmitResponse, HttpStatus.OK);
    }

    @PostMapping("deleteuser")
    public ResponseEntity<FormSubmitResponse> deleteUserHandler(
            @RequestParam("userId") @NotBlank String userId
    ) {
        FormSubmitResponse formSubmitResponse = usersService.deleteUser(Long.parseLong(userId));
        return new ResponseEntity<>(formSubmitResponse, HttpStatus.OK);
    }

    @PostMapping("edituser")
    public ResponseEntity<FormSubmitResponse> editUserHandler(
            @RequestParam("username") @NotBlank String username,
            @RequestParam("roleId") @NotBlank String roleId,
            @RequestParam("userId") @NotBlank String userId
    ) {
        FormSubmitResponse formSubmitResponse = usersService.editUser(Long.parseLong(userId), username, Long.parseLong(roleId));
        return new ResponseEntity<>(formSubmitResponse, HttpStatus.OK);
    }
}
