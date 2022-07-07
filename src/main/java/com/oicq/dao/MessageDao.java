package com.oicq.dao;

import com.oicq.entity.Friend;
import com.oicq.entity.Message;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface MessageDao {
    List<Message> getMessages(Friend friend);
    void insert(Message message);
    void deleteByMeAndFriend(Friend friend);
}
