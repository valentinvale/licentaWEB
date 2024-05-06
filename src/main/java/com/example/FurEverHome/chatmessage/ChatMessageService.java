package com.example.FurEverHome.chatmessage;

import com.example.FurEverHome.chatroom.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;

    @Autowired
    public ChatMessageService(ChatMessageRepository chatMessageRepository, ChatRoomService chatRoomService) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomService = chatRoomService;
    }

    public ChatMessage save(ChatMessage chatMessage) {
        var chatRoom = chatRoomService.getOrCreateChatRoom(chatMessage.getSenderId(), chatMessage.getReceiverId(), true);
        chatMessage.setChatRoom(chatRoom);
        chatMessageRepository.save(chatMessage);
        return chatMessage;
    }

    public List<ChatMessage> findChatMessages(UUID senderId, UUID receiverId) {
        var chatRoom = chatRoomService.getOrCreateChatRoom(senderId, receiverId, false);
        if(chatRoom == null) {
            return List.of();
        }
        return chatMessageRepository.findAllByChatRoomId(chatRoom.getId());
    }

    public List<ChatMessage> findMessagesContainingUser(UUID userId) {
        return chatMessageRepository.findAllBySenderIdOrReceiverId(userId, userId);
    }
}
