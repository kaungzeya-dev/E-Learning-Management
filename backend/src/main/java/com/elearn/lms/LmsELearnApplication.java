package com.elearn.lms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Collections;

@SpringBootApplication
public class LmsELearnApplication {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(LmsELearnApplication.class);
        String port = System.getenv("PORT");
        if (port != null && !port.isBlank()) {
            app.setDefaultProperties(Collections.singletonMap("server.port", port));
        }
        app.run(args);
    }
}
