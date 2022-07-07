package com.oicq.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Integer id;
    private String email;
    private String nickname;
    private String password;
    private String birthday = new Date().toString();//默认注册日
    private String url = "/images/normal.png";//默认头像
    private String phone;
    private String signature;
    private String sex = null;//默认性别未知
    private String register_time = new Date().toString();//默认注册日
}
