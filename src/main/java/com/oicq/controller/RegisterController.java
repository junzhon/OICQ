package com.oicq.controller;

import com.oicq.entity.User;
import com.oicq.entity.VerifyCode;
import com.oicq.service.CodeService;
import com.oicq.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RegisterController {

//    @Autowired
//    private MailService mailService;

    @Autowired
    private CodeService codeService;

    @Autowired
    private UserService userService;

/*
    @PostMapping("/getVerifyCode")
    public Map<String,Object> getCode(@RequestBody Map<String,Object> map) throws Exception{
        String email = (String) map.get("email");
        Map<String,Object> response = new HashMap<>();

        User user = userService.getOneByEmail(email);
        if(user!=null){
            response.put("status",100);
            response.put("msg","该邮箱已经注册过了！");
            return response;
        }

        VerifyCode verifyCode = codeService.getOne(email);
        if(verifyCode!=null){
            codeService.deleteOne(email);
        }
        String code = mailService.sendMail(email);
        VerifyCode verifyCode1 = new VerifyCode(email,code);
        codeService.insertOne(verifyCode1);
        response.put("status",200);
        response.put("msg","验证码已经发送到您的邮箱！");
        return response;
    }
*/
    @PostMapping("/userPost")
    public Map<String,Object> postUser(@RequestBody Map<String,Object> map){
        String nickname = (String) map.get("nickname");
        String email = (String) map.get("email");
        String password = (String) map.get("password");

        Map<String,Object> response = new HashMap<>();
        User user1 = userService.getOneByEmail(email);
        if(user1!=null){
            response.put("status",100);
            response.put("msg","该邮箱已经注册过了！");
            return response;
        }
        if(password.length()<3){
            response.put("status",100);
            response.put("msg","密码位数不能低于3位！");
            return response;
        }
//        VerifyCode code1 = codeService.getOne(email);
//        if(code1!=null){
//            if(!code1.getCode().equals(code)){
//                response.put("status",100);
//                response.put("msg","验证码错误！");
//                return response;
//            }else {
//                User user = new User();
//                user.setEmail(email);
//                user.setNickname(nickname);
//                user.setPassword(password);
//                userService.insertOne(user);
//            }
//        }else {
//            response.put("status",100);
//            response.put("msg","好像没有这个邮箱的验证码哦！");
//            return response;
//        }
        User user = new User();
        user.setEmail(email);
        user.setNickname(nickname);
        user.setPassword(password);
        userService.insertOne(user);
        response.put("status",200);
        response.put("msg","注册成功！");
        return response;
    }
}
