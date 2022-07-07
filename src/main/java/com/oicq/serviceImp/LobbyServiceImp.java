package com.oicq.serviceImp;

import com.oicq.dao.LobbyDao;
import com.oicq.entity.Lobby;
import com.oicq.service.LobbyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LobbyServiceImp implements LobbyService {
    @Autowired
    private LobbyDao lobbyDao;
    @Override
    public List<Lobby> getAll() {
        return lobbyDao.getAll();
    }

    @Override
    public void insert(Lobby lobby) {
        lobbyDao.insert(lobby);
    }
}
