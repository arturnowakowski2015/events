package com.eventsRegistry.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // ensure /merge/** is served from classpath:/static/merge/
        registry.addResourceHandler("/merge/**")
                .addResourceLocations("classpath:/static/merge/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Root path should open the static merge page instead of returning Whitelabel 404.
        registry.addRedirectViewController("/", "/merge/index.html");
    }
}