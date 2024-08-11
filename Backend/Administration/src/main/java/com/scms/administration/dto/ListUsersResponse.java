package com.scms.administration.dto;

import java.util.List;

public class ListUsersResponse {
    private List<DataReferenceElement> roles;
    private List<UserDto> users;

    public ListUsersResponse(List<DataReferenceElement> roles, List<UserDto> users) {
        this.roles = roles;
        this.users = users;
    }

    public List<DataReferenceElement> getRoles() {
        return roles;
    }

    public void setRoles(List<DataReferenceElement> roles) {
        this.roles = roles;
    }

    public List<UserDto> getUsers() {
        return users;
    }

    public void setUsers(List<UserDto> users) {
        this.users = users;
    }
}
