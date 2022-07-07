package com.oicq.service;

import com.oicq.entity.Notice;
import com.oicq.entity.NoticeQuery;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface NoticeService {
    void insert(Notice notice);
    Notice getByFromAndTo(Notice notice);
    List<NoticeQuery> getByFromOrTo(String id);
    Notice getById(String id);
    void deleteById(String id);
}
