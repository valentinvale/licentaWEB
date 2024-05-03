package com.example.FurEverHome.chatmessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatMessageController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatMessageService chatMessageService;

    @Autowired
    public ChatMessageController(ChatMessageService chatMessageService, SimpMessagingTemplate simpMessagingTemplate) {
        this.chatMessageService = chatMessageService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/chat")
    public void processMessage(ChatMessage chatMessage) {
        ChatMessage saved = chatMessageService.save(chatMessage);
        simpMessagingTemplate.convertAndSendToUser(chatMessage.getReceiverId().toString(),
                "/queue/messages",
                ChatNotification.builder()
                        .id(saved.getId())
                        .senderId(saved.getSenderId())
                        .content(saved.getContent())
                        .build()
        );
    }

    @GetMapping("/messages/{senderId}/{receiverId}")
    public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable("senderId") UUID senderId, @PathVariable("receiverId") UUID receiverId) {
        List<ChatMessage> chatMessages = chatMessageService.findChatMessages(senderId, receiverId);
        return ResponseEntity.ok(chatMessages);
    }

}
