package com.scms.administration.dto;

public class LoginResponse {
    private String username;
    private String roleDescription;
    private String token;

    public LoginResponse(String username, String roleDescription, String token) {
        this.username = username;
        this.roleDescription = roleDescription;
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRoleDescription() {
        return roleDescription;
    }

    public void setRoleDescription(String roleDescription) {
        this.roleDescription = roleDescription;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
