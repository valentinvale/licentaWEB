package com.example.FurEverHome.chatmessage;

import com.example.FurEverHome.chatroom.ChatRoom;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(generator = "uuid2", strategy = GenerationType.AUTO)
    private UUID id;
    @ManyToOne
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;
    @Column
    private UUID senderId;
    @Column
    private UUID receiverId;
    @Column
    private String content;
    @Column
    private Date timestamp;
}
