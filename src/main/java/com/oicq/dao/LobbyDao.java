package com.oicq.dao;

import com.oicq.entity.Lobby;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface LobbyDao {
    List<Lobby> getAll();
    void insert(Lobby lobby);
}
