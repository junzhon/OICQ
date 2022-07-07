package com.oicq.service;

import com.oicq.entity.GroupMsg;
import com.oicq.entity.GroupMsgQuery;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface GroupMsgService {
    void insert(GroupMsg groupMsg);
    List<GroupMsgQuery> getByGroupId(String id);
    void deleteByGroupId(String id);
}
