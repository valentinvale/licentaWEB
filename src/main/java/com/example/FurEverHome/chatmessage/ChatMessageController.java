package com.example.FurEverHome.chatmessage;

import com.example.FurEverHome.chatroom.ChatRoom;
import com.example.FurEverHome.chatroom.ChatRoomService;
import com.example.FurEverHome.user.User;
import com.example.FurEverHome.user.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatMessageController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;

    @Autowired
    public ChatMessageController(ChatMessageService chatMessageService, SimpMessagingTemplate simpMessagingTemplate, ChatRoomService chatRoomService) {
        this.chatMessageService = chatMessageService;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.chatRoomService = chatRoomService;
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

    @GetMapping("/conversations/{userId}")
    public ResponseEntity<List<UUID>> getConversations(@PathVariable("userId") UUID userId) {
        List<ChatRoom> chatRooms = chatRoomService.getUserChatRooms(userId);
        List<UUID> users = new ArrayList<>();
        for (ChatRoom chatRoom : chatRooms) {
            if (chatRoom.getSenderId().equals(userId)) {
                users.add(chatRoom.getReceiverId());
            } else {
                users.add(chatRoom.getSenderId());
            }
        }
        // remove duplicates
        List<UUID> distinctUsers = new ArrayList<>();
        for (UUID user : users) {
            if (!distinctUsers.contains(user)) {
                distinctUsers.add(user);
            }
        }
        return ResponseEntity.ok(distinctUsers);
    }

}
