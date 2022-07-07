package com.oicq.service;

import com.oicq.entity.Friend;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FriendService {
    List<Integer> findMyFriends(String id);
    void insert(Friend friend);
    Friend getByMeAndFriend(Friend friend);
    void deleteFriend(Friend friend);
}
