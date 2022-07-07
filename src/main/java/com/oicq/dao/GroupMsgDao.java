package com.oicq.dao;

import com.oicq.entity.GroupMsg;
import com.oicq.entity.GroupMsgQuery;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface GroupMsgDao {
    void insert(GroupMsg groupMsg);
    List<GroupMsgQuery> getByGroupId(String id);
    void deleteByGroupId(String id);
}
