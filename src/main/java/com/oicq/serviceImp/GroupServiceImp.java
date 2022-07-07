package com.oicq.serviceImp;

import com.oicq.dao.GroupDao;
import com.oicq.entity.Group;
import com.oicq.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupServiceImp implements GroupService {
    @Autowired
    private GroupDao groupDao;
    @Override
    public void insert(Group group) {
        groupDao.insert(group);
    }

    @Override
    public Integer getCount() {
        Integer id = groupDao.getCount();
        //先判断id是否为空
        if(id==null){
            //初始化群id
            groupDao.initGroupId(100);
            return groupDao.getCount();
        }
        return id;
    }

    @Override
    public void idPlus() {
        groupDao.idPlus();
    }

    @Override
    public List<Group> getMyGroup(String id) {
        return groupDao.getMyGroup(id);
    }

    @Override
    public List<Group> getByKeyword(String keyword) {
        return groupDao.getByKeyword(keyword);
    }

    @Override
    public void deleteById(String id) {
        groupDao.deleteById(id);
    }

    @Override
    public void updateById(Group group) {
        groupDao.updateById(group);
    }
}
