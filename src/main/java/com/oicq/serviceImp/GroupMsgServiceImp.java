package com.oicq.serviceImp;

import com.oicq.dao.GroupMsgDao;
import com.oicq.entity.GroupMsg;
import com.oicq.entity.GroupMsgQuery;
import com.oicq.service.GroupMsgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupMsgServiceImp implements GroupMsgService {
    @Autowired
    private GroupMsgDao groupMsgDao;

    @Override
    public void insert(GroupMsg groupMsg) {
        groupMsgDao.insert(groupMsg);
    }

    @Override
    public List<GroupMsgQuery> getByGroupId(String id) {
        return groupMsgDao.getByGroupId(id);
    }

    @Override
    public void deleteByGroupId(String id) {
        groupMsgDao.deleteByGroupId(id);
    }
}
