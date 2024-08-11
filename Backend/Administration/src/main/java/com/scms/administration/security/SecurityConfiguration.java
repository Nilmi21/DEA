package com.scms.administration.security;

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

    @Value("${scms.cors.customers}")
    private String customers;

    @Value("${scms.cors.suppliers}")
    private String suppliers;

    @Value("${scms.cors.products}")
    private String products;

    @Value("${scms.cors.invoices}")
    private String invoices;
    private final EntryUserAuthenticationProvider entryUserAuthenticationProvider;
    private final EntryUserDetailsService entryUserDetailsService;

    @Autowired
    public SecurityConfiguration(EntryUserAuthenticationProvider entryUserAuthenticationProvider, EntryUserDetailsService entryUserDetailsService) {
        this.entryUserAuthenticationProvider = entryUserAuthenticationProvider;
        this.entryUserDetailsService = entryUserDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> {
            CorsConfigurationSource source = request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(
                        List.of(origin, customers, suppliers, products, invoices));
                config.setAllowedHeaders(
                        List.of("Authorization"));
                config.setAllowedMethods(
                        List.of("GET", "POST", "DELETE", "PUT"));
                return config;
            };
            cors.configurationSource(source);
        });
        http.csrf(AbstractHttpConfigurer::disable);
        http.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterAt(new EntryUserFilter(entryUserAuthenticationProvider), BasicAuthenticationFilter.class)
            .addFilterAfter(new JwtAuthenticationFilter(entryUserDetailsService), BasicAuthenticationFilter.class);
        http.authorizeHttpRequests((auth) ->
                auth.requestMatchers("/users/adduser/**").hasAuthority("1")
                        .requestMatchers("/users/edituser/**").hasAuthority("1")
                        .requestMatchers("/users/deleteuser/**").hasAuthority("1")
                        .requestMatchers("/users/adduser/**").hasAuthority("2")
                        .requestMatchers("/users/edituser/**").hasAuthority("2")
                        .requestMatchers("/users/adduser/**").hasAuthority("3")
                        .requestMatchers("/users/listusers/**").authenticated()
                        .requestMatchers("/authentication/requireauth/**").permitAll()
                        .requestMatchers("/authentication/authenticate/**").permitAll()
                        .requestMatchers("/authentication/login/**").permitAll()
                        .anyRequest().denyAll()

        );
        return http.build();
    }
}
