package com.oicq.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpSession;

@Controller
public class GetController {
    //登录页
    @GetMapping({"/","/login","/login.html"})
    public String toLogin(){
        return "login";
    }
    //注册页面
    @GetMapping({"/register","register.html"})
    public String toRegister(){
        return "register";    }
    //忘记密码页
    @GetMapping({"/forgot-password","forgot-password.html"})
    public String toForgotPassword(){
        return "forgot-password";
    }
    //主页
    @GetMapping({"/index","/index.html"})
    public String toIndex(){
        return "index";
    }
    //注销登录
    @GetMapping("/logout")
    public String logout(HttpSession session){
        session.removeAttribute("user");
        return "login";
    }
    //访客
    @GetMapping("/visit")
    public String visit(){
        return "visit";
    }
}
