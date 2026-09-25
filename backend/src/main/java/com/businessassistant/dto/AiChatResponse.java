package com.businessassistant.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AiChatResponse {

    private String reply;
    private String language;
    private List<String> suggestedActions;
    private String contextSummary;
    private LocalDateTime timestamp;

    public AiChatResponse() {
    }

    public AiChatResponse(String reply, String language, List<String> suggestedActions, String contextSummary) {
        this.reply = reply;
        this.language = language;
        this.suggestedActions = suggestedActions;
        this.contextSummary = contextSummary;
        this.timestamp = LocalDateTime.now();
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public List<String> getSuggestedActions() {
        return suggestedActions;
    }

    public void setSuggestedActions(List<String> suggestedActions) {
        this.suggestedActions = suggestedActions;
    }

    public String getContextSummary() {
        return contextSummary;
    }

    public void setContextSummary(String contextSummary) {
        this.contextSummary = contextSummary;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
