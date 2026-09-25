package com.businessassistant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BusinessAssistantApplication {

    public static void main(String[] args) {
        SpringApplication.run(BusinessAssistantApplication.class, args);
        System.out.println("==========================================================");
        System.out.println(" BizPartner AI (Module 1) Backend Started Successfully! ");
        System.out.println(" REST API available at: http://localhost:8080/api         ");
        System.out.println(" H2 Console (Dev):     http://localhost:8080/h2-console  ");
        System.out.println("==========================================================");
    }
}
