package com.oicq.controller;


import com.oicq.entity.User;

import com.oicq.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

import java.util.Map;

@RestController
public class ForgetPwController {
    @Autowired
    private UserService userService;

    @PostMapping("/get_password")
    public Map<String,Object> get_password(@RequestBody Map<String,Object> map){
        String email = (String) map.get("email");
        Map<String, Object> response = new HashMap<>();
        User user = userService.getOneByEmail(email);
        if(user==null){
            response.put("status",100);
            response.put("msg","该邮箱未注册！");
            return response;
        }

        response.put("status", 200);
        return response;
    }
}
