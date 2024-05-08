package com.example.FurEverHome.chatroom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ChatRoomService {


    private final ChatRoomRepository chatRoomRepository;

    @Autowired
    public ChatRoomService(ChatRoomRepository chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
    }

    public ChatRoom getOrCreateChatRoom(UUID senderID, UUID receiverID, boolean createIfNotExist){
        ChatRoom chatRoom = chatRoomRepository.findBySenderIdAndReceiverId(senderID, receiverID);
        if (chatRoom == null) {
            chatRoom = chatRoomRepository.findBySenderIdAndReceiverId(receiverID, senderID);
            if (chatRoom == null && createIfNotExist) {
                chatRoom = ChatRoom.builder().senderId(senderID).receiverId(receiverID).build();
                chatRoomRepository.save(chatRoom);
            }
        }
        return chatRoom;
    }


    public List<ChatRoom> getUserChatRooms(UUID userId) {
        return chatRoomRepository.findAllBySenderIdOrReceiverId(userId, userId);
    }

}
