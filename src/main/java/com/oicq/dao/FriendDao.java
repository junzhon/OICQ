package com.oicq.dao;

import com.oicq.entity.Friend;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface FriendDao {
    List<Integer> findMyFriends(String id);
    void insert(Friend friend);
    Friend getByMeAndFriend(Friend friend);
    void deleteFriend(Friend friend);
}
