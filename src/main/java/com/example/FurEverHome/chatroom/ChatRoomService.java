package com.example.FurEverHome.chatroom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
            if (createIfNotExist) {
                chatRoom = ChatRoom.builder().senderId(senderID).receiverId(receiverID).build();
                chatRoomRepository.save(chatRoom);
            }
        }
        return chatRoom;
    }

}
