package com.scms.administration.api;

import com.scms.administration.dto.LoginResponse;
import com.scms.administration.dto.RequireAuthResponse;
import com.scms.administration.dto.UserDto;
import com.scms.administration.model.User;
import com.scms.administration.security.EntryUserAuthenticationToken;
import com.scms.administration.security.EntryUserDetails;
import com.scms.administration.security.SecurityConstants;
import io.jsonwebtoken.io.Decoders;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

    @GetMapping("requireauth")
    public ResponseEntity<RequireAuthResponse> requireAuthHandler() {
        return new ResponseEntity<>(new RequireAuthResponse(true), HttpStatus.OK);
    }

    @GetMapping("authenticate")
    public ResponseEntity<UserDto> authenticateHandler(
            @RequestParam("key") @NotBlank String key
    ) {
        String decodedKey = new String(Decoders.BASE64.decode(SecurityConstants.API_KEY));
        if(decodedKey.equals(key)) {
            EntryUserDetails currentUser = (EntryUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return new ResponseEntity<>(new UserDto(currentUser.getUser().getUserId(), currentUser.getUsername(),
                    currentUser.getUser().getRole().getRoleId()), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @PostMapping("login")
    public ResponseEntity<LoginResponse> loginHandler() {
        EntryUserDetails entryUserDetails = (EntryUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LoginResponse loginResponse = new LoginResponse(
                entryUserDetails.getUser().getUsername(),
                entryUserDetails.getUser().getRole().getRoleDescription(),
                entryUserDetails.getToken()
        );
        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }

}

