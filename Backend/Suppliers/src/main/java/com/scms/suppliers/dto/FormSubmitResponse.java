package com.scms.suppliers.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class FormSubmitResponse {

    private Message message;
    private List<Error> errors;
}
