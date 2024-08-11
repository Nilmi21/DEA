package com.scms.products.dto;

public class UserDto {
    private long userId;
    private String username;
    private long roleId;

    public UserDto(long userId, String username, long roleId) {
        this.userId = userId;
        this.username = username;
        this.roleId = roleId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public long getRoleId() {
        return roleId;
    }

    public void setRoleId(long roleId) {
        this.roleId = roleId;
    }
}
