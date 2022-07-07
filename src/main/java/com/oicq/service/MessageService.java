package com.oicq.service;

import com.oicq.entity.Friend;
import com.oicq.entity.Message;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MessageService {
    void insert(Message message);
    List<Message> getMessages(Friend friend);
    void deleteByMeAndFriend(Friend friend);
}
