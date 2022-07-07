package com.oicq.controller;

import com.oicq.entity.User;
import com.oicq.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
public class LoginController {

    @Autowired
    private UserService userService;


    @PostMapping("/loginPost")
    public Map<String,Object> getCode(@RequestBody Map<String,Object> map, HttpSession session) throws Exception {
        String email = (String) map.get("email");
        String password = (String) map.get("password");
        Map<String, Object> response = new HashMap<>();

        User user = userService.getOneByEmail(email);
        if (user == null) {
            response.put("status", 0);
            response.put("msg", "该邮箱还未注册！");
            return response;
        }
        if(!password.equals(user.getPassword())){
            response.put("status", 100);
            response.put("msg","密码错误!");
            return response;
        }
        response.put("status", 200);
        response.put("id",user.getId());
        session.setAttribute("user",user);
        return response;
    }
}
