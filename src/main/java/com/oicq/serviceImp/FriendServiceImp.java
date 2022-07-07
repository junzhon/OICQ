package com.oicq.serviceImp;

import com.oicq.dao.FriendDao;
import com.oicq.entity.Friend;
import com.oicq.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendServiceImp implements FriendService {

    @Autowired
    private FriendDao friendDao;

    @Override
    public List<Integer> findMyFriends(String id) {
        return friendDao.findMyFriends(id);
    }

    @Override
    public void insert(Friend friend) {
        friendDao.insert(friend);
    }

    @Override
    public Friend getByMeAndFriend(Friend friend) {
        return friendDao.getByMeAndFriend(friend);
    }

    @Override
    public void deleteFriend(Friend friend) {
        friendDao.deleteFriend(friend);
    }
}
