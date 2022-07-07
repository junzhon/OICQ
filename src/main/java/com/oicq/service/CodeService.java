package com.oicq.service;

import com.oicq.entity.VerifyCode;
import org.springframework.stereotype.Service;

@Service
public interface CodeService {
    void insertOne(VerifyCode code);
    void deleteOne(String email);
    VerifyCode getOne(String email);
}
