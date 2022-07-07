package com.oicq.dao;

import com.oicq.entity.Notice;
import com.oicq.entity.NoticeQuery;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface NoticeDao {
    void deleteById(String id);
    void insert(Notice notice);
    Notice getByFromAndTo(Notice notice);
    List<NoticeQuery> getByFromOrTo(String id);
    Notice getById(String id);
}
