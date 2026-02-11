package com.bytecode.chat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private String senderEmail;
    private String content;
    private String type; // CHAT, JOIN, LEAVE
}
