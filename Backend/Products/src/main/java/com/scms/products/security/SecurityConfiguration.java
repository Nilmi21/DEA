package com.scms.products.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfiguration {
    @Value("${scms.cors.origin}")
    private String origin;

    private final EntryUserAuthenticationProvider entryUserAuthenticationProvider;

    @Autowired
    public SecurityConfiguration(EntryUserAuthenticationProvider entryUserAuthenticationProvider) {
        this.entryUserAuthenticationProvider = entryUserAuthenticationProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> {
            CorsConfigurationSource source = request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(
                        List.of(origin));
                config.setAllowedHeaders(
                        List.of("Authorization", "Content-Type"));
                config.setAllowedMethods(
                        List.of("GET", "POST", "PUT", "DELETE"));
                return config;
            };
            cors.configurationSource(source);
        });
        http.csrf(AbstractHttpConfigurer::disable);
        http.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterAt(new AuthenticationFilter(entryUserAuthenticationProvider), BasicAuthenticationFilter.class);
        http.authorizeHttpRequests((auth) -> auth.anyRequest().permitAll());
        return http.build();
    }
}
