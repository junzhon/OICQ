package com.oicq.serviceImp;

import com.oicq.entity.VerifyCode;
import com.oicq.dao.CodeDao;
import com.oicq.service.CodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CodeServiceImp implements CodeService {

    @Autowired
    private CodeDao codeDao;

    @Override
    public void insertOne(VerifyCode code) {
        codeDao.insertOne(code);
    }

    @Override
    public void deleteOne(String email) {
        codeDao.deleteOne(email);
    }

    @Override
    public VerifyCode getOne(String email) {
        return codeDao.getOne(email);
    }
}
