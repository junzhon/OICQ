package com.oicq.entity;

import lombok.Data;

@Data
public class UserSearch {
    private Integer id;
    private String email;
    private String nickname;
    private String url;
    private String sex;
    private String phone;
    private String signature;
    private String birthday;
}
