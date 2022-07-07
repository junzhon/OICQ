package com.oicq.serviceImp;

import com.oicq.entity.User;
import com.oicq.dao.UserDao;
import com.oicq.entity.UserSearch;
import com.oicq.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
 public class UserServiceImp implements UserService {
    @Autowired
    private UserDao userDao;

    @Override
    public void insertOne(User user) {
        userDao.insertOne(user);
    }

    @Override
    public User getOneByEmail(String email) {
        return userDao.getOneByEmail(email);
    }

    @Override
    public void updateByUser(User user) {
        userDao.updateByUser(user);
    }

    @Override
    public User getOneById(String id) {
        return userDao.getOneById(id);
    }

    @Override
    public List<UserSearch> getByKeyword(String keyword) {
        return userDao.getByKeyword(keyword);
    }


    @Override
    public UserSearch getOnline(String id) {
        return userDao.getOnline(id);
    }

    @Override
    public List<UserSearch> getFriendList(String id) {
        return userDao.getFriendList(id);
    }
}
