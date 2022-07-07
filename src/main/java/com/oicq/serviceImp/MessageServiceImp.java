package com.oicq.serviceImp;

import com.oicq.dao.MessageDao;
import com.oicq.entity.Friend;
import com.oicq.entity.Message;
import com.oicq.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImp implements MessageService {

    @Autowired
    private MessageDao messageDao;

    @Override
    public void insert(Message message) {
        messageDao.insert(message);
    }

    @Override
    public List<Message> getMessages(Friend friend) {
        return messageDao.getMessages(friend);
    }

    @Override
    public void deleteByMeAndFriend(Friend friend) {
        messageDao.deleteByMeAndFriend(friend);
    }
}
