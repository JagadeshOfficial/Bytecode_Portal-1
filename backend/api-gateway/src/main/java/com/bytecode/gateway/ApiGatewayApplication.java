package com.bytecode.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.web.cors.reactive.CorsWebFilter corsWebFilter() {
		org.springframework.web.cors.CorsConfiguration corsConfig = new org.springframework.web.cors.CorsConfiguration();
		corsConfig.setAllowedOrigins(java.util.List.of("http://localhost:3000"));
		corsConfig.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		corsConfig.setAllowedHeaders(java.util.List.of("*"));
		corsConfig.setAllowCredentials(true);

		org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", corsConfig);

		return new org.springframework.web.cors.reactive.CorsWebFilter(source);
	}

}
