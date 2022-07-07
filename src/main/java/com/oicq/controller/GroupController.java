package com.oicq.controller;

import com.oicq.entity.*;
import com.oicq.service.GroupMsgService;
import com.oicq.service.GroupService;
import com.oicq.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class GroupController {
    @Autowired
    private GroupService groupService;
    @Autowired
    private MemberService memberService;
    @Autowired
    private GroupMsgService groupMsgService;
    /**
     *创建群聊
     */
    @PostMapping("/create_group")
    public Map<String,Object> getInfo(@RequestBody Map<String,Object> map){
        String url = (String) map.get("url");
        String name = (String) map.get("name");
        String owner_id = (String) map.get("id");
        Map<String, Object> response = new HashMap<>();
        Integer id = groupService.getCount();//群号
        Group group = new Group(id,name,Integer.valueOf(owner_id),new Date().toString(),url);
        groupService.insert(group);
        //id++
        groupService.idPlus();
        //把群主插入到群成员中
        Member member = new Member(null,id,Integer.valueOf(owner_id),new Date().toString());
        memberService.insert(member);
        response.put("status", 200);
        return response;
    }
    /**
     *修改群聊信息
     */
    @PostMapping("/update_group")
    public Map<String,Object> update_group(@RequestBody Map<String,Object> map){
        String url = (String) map.get("url");
        String name = (String) map.get("name");
        String id = (String) map.get("id");
        Map<String, Object> response = new HashMap<>();
        Group group = new Group(Integer.valueOf(id),name,null,null,url);
        groupService.updateById(group);
        response.put("status", 200);
        return response;
    }

    /**
     * 获取我的群聊
     */
    @PostMapping("/get_my_group")
    public Map<String,Object> getMyGroup(@RequestBody Map<String,Object> map){
        String id = (String) map.get("id");
        Map<String, Object> response = new HashMap<>();
        List<Group> groups = groupService.getMyGroup(id);
        response.put("status", 200);
        response.put("groups",groups);
        return response;
    }
    /**
     * 获取我的群聊消息
     */
    @PostMapping("/get_group_messages")
    public Map<String,Object> getMyGroupMsg(@RequestBody Map<String,Object> map){
        String id = (String) map.get("id");
        Map<String, Object> response = new HashMap<>();
        List<GroupMsgQuery> messages = groupMsgService.getByGroupId(id);
        response.put("status", 200);
        response.put("messages",messages);
        return response;
    }
    /**
     * 发送群聊消息
     */
    @PostMapping("/send_group_message")
    public Map<String,Object> sendGroupMsg(@RequestBody Map<String,Object> map){
        String group_id = (String) map.get("group_id");
        String member_id = (String) map.get("member_id");
        String content = (String) map.get("content");
        String time = (String) map.get("time");
        Map<String, Object> response = new HashMap<>();
        GroupMsg msg = new GroupMsg(null,Integer.valueOf(group_id),Integer.valueOf(member_id),content,time);
        groupMsgService.insert(msg);
        response.put("status", 200);
        return response;
    }
    /**
     * 获取群成员
     */
    @PostMapping("/get_group_members")
    public Map<String,Object> getGroupMembers(@RequestBody Map<String,Object> map){
        String group_id = (String) map.get("id");
        Map<String, Object> response = new HashMap<>();
        List<UserSearch> members = memberService.getByGroupId(group_id);
        response.put("status", 200);
        response.put("members",members);
        return response;
    }
    /**
     * 获邀请好友入群
     */
    @PostMapping("/invite_friend")
    public Map<String,Object> invite_friend(@RequestBody Map<String,Object> map){
        String group_id = (String) map.get("group_id");
        String member_id = (String) map.get("member_id");
        Map<String, Object> response = new HashMap<>();
        //先判断好友是不是已经在群里了
        Member member = new Member(null,Integer.valueOf(group_id),Integer.valueOf(member_id),null);
        Member m = memberService.getByIds(member);
        if(m!=null){
            response.put("status", 100);
            response.put("msg","该好友已经在这个群里面了！");
            return response;
        }
        //插入一条数据
        member.setTime(new Date().toString());
        memberService.insert(member);
        response.put("status", 200);
        return response;
    }
    /**
     * 搜索群聊
     */
    @PostMapping("/search_group")
    public Map<String,Object> search_group(@RequestBody Map<String,Object> map){
        String keyword = (String) map.get("keyword");
        Map<String, Object> response = new HashMap<>();
        List<Group> groups = groupService.getByKeyword(keyword);
        response.put("status", 200);
        response.put("groups",groups);
        return response;
    }
    /**
     * 清除群聊天记录
     */
    @PostMapping("/clear_group_messages")
    public Map<String,Object> clear_group_messages(@RequestBody Map<String,Object> map){
        String id = (String) map.get("id");
        groupMsgService.deleteByGroupId(id);
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        return response;
    }
    /**
     * 解散群聊
     */
    @PostMapping("/delete_group")
    public Map<String,Object> delete_group(@RequestBody Map<String,Object> map){
        String id = (String) map.get("id");
        //清除群聊的聊天记录
        groupMsgService.deleteByGroupId(id);
        //删除所有群成员
        memberService.deleteByGroupId(id);
        //删除群聊
        groupService.deleteById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        return response;
    }
    /**
     * 退出群聊,或踢出群聊
     */
    @PostMapping({"/quit_group","/tick_out"})
    public Map<String,Object> quit_group(@RequestBody Map<String,Object> map){
        String group_id = (String) map.get("group_id");
        String member_id = (String) map.get("member_id");
        Member member = new Member(null,Integer.valueOf(group_id),Integer.valueOf(member_id),null);
        memberService.deleteMember(member);
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        return response;
    }
    /**
     * 获取成员id
     */
    @PostMapping("/get_members_id")
    public Map<String,Object> get_members_id(@RequestBody Map<String,Object> map){
        String group_id = (String) map.get("group_id");
        List<Integer> ids = memberService.getMembersId(group_id);
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("ids",ids);
        return response;
    }
}
