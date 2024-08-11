package com.scms.administration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class AdministrationApplication {
	public static void main(String[] args) {
		SpringApplication.run(AdministrationApplication.class, args);
	}
}
