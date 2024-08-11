package com.scms.administration.dto;

import java.util.List;

public class FormSubmitResponse {
    private Message message;
    private List<Error> errors;

    public FormSubmitResponse(Message message, List<Error> errors) {
        this.message = message;
        this.errors = errors;
    }

    public Message getMessage() {
        return message;
    }

    public void setMessage(Message message) {
        this.message = message;
    }

    public List<Error> getErrors() {
        return errors;
    }

    public void setErrors(List<Error> errors) {
        this.errors = errors;
    }
}