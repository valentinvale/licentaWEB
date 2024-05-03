package com.example.FurEverHome.chatmessage;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatNotification {
    private UUID id;
    private UUID senderId;
    private UUID receiverId;
    private String content;
}
