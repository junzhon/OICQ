package com.oicq.dao;

import com.oicq.entity.Group;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface GroupDao {
    void insert(Group group);
    Integer getCount();
    void idPlus();
    void initGroupId(Integer id);
    List<Group> getMyGroup(String id);
    List<Group> getByKeyword(String keyword);
    void deleteById(String id);
    void updateById(Group group);
}
