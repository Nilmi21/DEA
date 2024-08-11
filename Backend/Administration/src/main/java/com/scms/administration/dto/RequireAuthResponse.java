package com.scms.administration.dto;

public class RequireAuthResponse {
    private Boolean loggedIn;

    public RequireAuthResponse(Boolean loggedIn) {
        this.loggedIn = loggedIn;
    }

    public Boolean getLoggedIn() {
        return loggedIn;
    }

    public void setLoggedIn(Boolean loggedIn) {
        this.loggedIn = loggedIn;
    }
}
