package com.businessassistant.controller;

import com.businessassistant.dto.GstReminderDTO;
import com.businessassistant.dto.GstSummaryDTO;
import com.businessassistant.service.GstService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gst")
@CrossOrigin(origins = "*")
public class GstController {

    private final GstService gstService;

    public GstController(GstService gstService) {
        this.gstService = gstService;
    }

    @GetMapping("/summary")
    public ResponseEntity<GstSummaryDTO> getSummary() {
        return ResponseEntity.ok(gstService.getGstSummary());
    }

    @GetMapping("/reminders")
    public ResponseEntity<List<GstReminderDTO>> getReminders() {
        return ResponseEntity.ok(gstService.getReminders());
    }

    @PostMapping("/reminders")
    public ResponseEntity<GstReminderDTO> createReminder(@Valid @RequestBody GstReminderDTO dto) {
        return ResponseEntity.ok(gstService.createReminder(dto));
    }

    @PutMapping("/reminders/{id}")
    public ResponseEntity<GstReminderDTO> updateReminder(@PathVariable Long id, @RequestBody GstReminderDTO dto) {
        return ResponseEntity.ok(gstService.updateReminder(id, dto));
    }

    @DeleteMapping("/reminders/{id}")
    public ResponseEntity<Map<String, String>> deleteReminder(@PathVariable Long id) {
        gstService.deleteReminder(id);
        return ResponseEntity.ok(Map.of("message", "GST Reminder deleted successfully"));
    }
}
