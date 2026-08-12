package com.healthbot.controller;

import com.healthbot.entity.ChatMessage;
import com.healthbot.repository.ChatMessageRepository;
import com.healthbot.service.PythonAiClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AiController {

    private final PythonAiClient pythonAiClient;
    private final ChatMessageRepository chatMessageRepository;

    public AiController(PythonAiClient pythonAiClient, ChatMessageRepository chatMessageRepository) {
        this.pythonAiClient = pythonAiClient;
        this.chatMessageRepository = chatMessageRepository;
    }

    @PostMapping("/symptom-checker")
    public Map checkSymptoms(@RequestBody Map<String, String> body) {
        String symptoms = body != null ? body.get("symptoms") : "";
        return pythonAiClient.checkSymptoms(symptoms);
    }

    @PostMapping("/explain-term")
    public Map<String, String> explainTerm(@RequestBody Map<String, String> body) {
        String term = body != null ? body.get("term") : "";
        String explanation = pythonAiClient.explainTerm(term);
        return Map.of("explanation", explanation != null ? explanation : "");
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> body) {
        Long userId = 1L;
        String userMessage = (body != null && body.get("message") != null) ? body.get("message") : "";

        ChatMessage userMsg = new ChatMessage();
        userMsg.setUserId(userId);
        userMsg.setRole("USER");
        userMsg.setMessage(userMessage);
        chatMessageRepository.save(userMsg);

        List<ChatMessage> history = chatMessageRepository.findByUserIdOrderByCreatedAtAsc(userId);
        String historyText = history.stream()
                .map(m -> m.getRole() + ": " + m.getMessage())
                .collect(Collectors.joining("\n"));

        String reply = pythonAiClient.chat(userMessage, historyText);
        if (reply == null) reply = "No reply received.";

        ChatMessage botMsg = new ChatMessage();
        botMsg.setUserId(userId);
        botMsg.setRole("ASSISTANT");
        botMsg.setMessage(reply);
        chatMessageRepository.save(botMsg);

        return Map.of("reply", reply);
    }

    @GetMapping("/chat/history")
    public List<ChatMessage> getHistory() {
        return chatMessageRepository.findByUserIdOrderByCreatedAtAsc(1L);
    }

    @PostMapping("/risk-assessment")
    public Map assessRisk(@RequestBody Map body) {
        return pythonAiClient.assessHealthRisk(body);
    }

    @PostMapping("/diet-planner")
    public Map generateDietPlan(@RequestBody Map body) {
        return pythonAiClient.generateDietPlan(body);
    }
}
