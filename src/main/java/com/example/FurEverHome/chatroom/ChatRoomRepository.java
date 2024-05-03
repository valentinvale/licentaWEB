package com.example.FurEverHome.chatroom;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {
    ChatRoom findBySenderIdAndReceiverId(UUID senderID, UUID receiverID);
}
