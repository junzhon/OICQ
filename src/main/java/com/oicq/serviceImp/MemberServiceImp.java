package com.oicq.serviceImp;

import com.oicq.dao.MemberDao;
import com.oicq.entity.Member;
import com.oicq.entity.UserSearch;
import com.oicq.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberServiceImp implements MemberService {
    @Autowired
    private MemberDao memberDao;
    @Override
    public void insert(Member member) {
        memberDao.insert(member);
    }

    @Override
    public List<UserSearch> getByGroupId(String id) {
        return memberDao.getByGroupId(id);
    }

    @Override
    public Member getByIds(Member member) {
        return memberDao.getByIds(member);
    }

    @Override
    public void deleteByGroupId(String id) {
        memberDao.deleteByGroupId(id);
    }

    @Override
    public void deleteMember(Member member) {
        memberDao.deleteMember(member);
    }

    @Override
    public List<Integer> getMembersId(String id) {
        return memberDao.getMembersId(id);
    }
}
