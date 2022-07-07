package com.oicq.dao;

import com.oicq.entity.Member;
import com.oicq.entity.UserSearch;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;


@Mapper
@Repository
public interface MemberDao {
    void insert(Member member);
    List<UserSearch> getByGroupId(String id);
    Member getByIds(Member member);
    void deleteByGroupId(String id);
    void deleteMember(Member member);
    List<Integer> getMembersId(String id);
}
