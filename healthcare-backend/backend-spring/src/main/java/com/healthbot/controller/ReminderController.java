package com.healthbot.controller;

import com.healthbot.entity.Reminder;
import com.healthbot.repository.ReminderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    private final ReminderRepository reminderRepository;

    public ReminderController(ReminderRepository reminderRepository) {
        this.reminderRepository = reminderRepository;
    }

    @PostMapping
    public Reminder create(@RequestBody Reminder reminder) {
        reminder.setUserId(1L);
        reminder.setActive(true);
        return reminderRepository.save(reminder);
    }

    @GetMapping
    public List<Reminder> getMyReminders() {
        return reminderRepository.findByUserIdAndActiveTrue(1L);
    }

    @PutMapping("/{id}/deactivate")
    public void deactivate(@PathVariable Long id) {
        Reminder r = reminderRepository.findById(id).orElseThrow();
        r.setActive(false);
        reminderRepository.save(r);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        reminderRepository.deleteById(id);
    }
}
