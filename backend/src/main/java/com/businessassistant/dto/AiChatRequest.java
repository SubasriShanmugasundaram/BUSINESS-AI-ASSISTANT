package com.businessassistant.dto;

import jakarta.validation.constraints.NotBlank;

public class AiChatRequest {

    @NotBlank(message = "Message cannot be empty")
    private String message;

    private String language = "en";

    public AiChatRequest() {
    }

    public AiChatRequest(String message, String language) {
        this.message = message;
        this.language = language != null ? language : "en";
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
