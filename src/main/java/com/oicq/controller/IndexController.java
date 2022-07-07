package com.oicq.controller;

import com.oicq.dao.NoticeDao;
import com.oicq.entity.*;
import com.oicq.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.*;

@RestController
public class IndexController {
    @Autowired
    private LobbyService lobbyService;
    @Autowired
    private NoticeService noticeService;
    @Autowired
    private UserService userService;
    @Autowired
    private FriendService friendService;
    @Autowired
    private MessageService messageService;

    /**
     *获取我的信息
     */
    @PostMapping("/get_my_info")
    public Map<String,Object> getInfo(@RequestBody Map<String,Object> map){
        String id = (String) map.get("id");
        Map<String, Object> response = new HashMap<>();
        User user = userService.getOneById(id);
        if (user == null) {
            response.put("status", 0);
            return response;
        }
        response.put("status", 200);
        response.put("user",user);
        return response;
    }
    @PostMapping("/update_my_info")
    public Map<String,Object> updateInfo(@RequestBody Map<String,Object> map){
        String id = (String) map.get("id");
        String nickname = (String) map.get("nickname");
        String sex = (String) map.get("sex");
        String birthday = (String) map.get("birthday");
        String phone = (String) map.get("phone");
        String signature = (String) map.get("signature");
        Map<String, Object> response = new HashMap<>();
        User user = userService.getOneById(id);
        if (user == null) {
            response.put("status", 0);
            return response;
        }
        user.setNickname(nickname);
        user.setSex(sex);
        user.setBirthday(birthday);
        user.setPhone(phone);
        user.setSignature(signature);
        userService.updateByUser(user);
        response.put("status", 200);
        return response;
    }
    //修改头像
    @PostMapping("/change_profile")
    public Map<String,Object> changeProfile(@RequestBody Map<String,Object> map){
        String id = (String) map.get("id");
        String url = (String) map.get("url");
        Map<String, Object> response = new HashMap<>();
        User user = userService.getOneById(id);
        if (user == null) {
            response.put("status", 0);
            return response;
        }
        user.setUrl(url);
        userService.updateByUser(user);
        response.put("status", 200);
        return response;
    }
    //修改密码
    @PostMapping("/change_password")
    public Map<String,Object> changePw(@RequestBody Map<String,Object> map){
        String id = (String) map.get("id");
        String old_pw = (String) map.get("old_pw");
        String new_pw = (String) map.get("new_pw");
        Map<String, Object> response = new HashMap<>();
        User user = userService.getOneById(id);
        if (user == null) {
            response.put("status", 0);
            return response;
        }
        if(!user.getPassword().equals(old_pw)){
            response.put("status", 100);
            response.put("msg", "旧密码错误！");
            return response;
        }
        if(new_pw.length()<3){
            response.put("status", 100);
            response.put("msg", "新密码位数不能小于3位！");
            return response;
        }
        user.setPassword(new_pw);
        userService.updateByUser(user);
        response.put("status", 200);
        return response;
    }
    //搜索好友
    @PostMapping("/search_user")
    public Map<String,Object> searchUser(@RequestBody Map<String,Object> map){
        String keyword = (String) map.get("keyword");
        String id = (String) map.get("id");
        Map<String, Object> response = new HashMap<>();
        if(keyword.equals("")){
            response.put("status",100);
            return response;//如果没有关键字 就丢掉
        }
        List<UserSearch> users = userService.getByKeyword(keyword);
        //除去已经是好友的用户
        List<Integer> friends = friendService.findMyFriends(id);
        friends.add(Integer.valueOf(id));
        users.removeIf(user -> friends.contains(user.getId()));

        response.put("status",200);
        response.put("users",users);
        return response;
    }
    //查询当前在线人数
    @PostMapping("/get_online")
    public Map<String,Object> getOnline(@RequestBody Map<String,Object> map){
        String ids = (String) map.get("ids");
        String[] iDs = ids.split(",");
        Map<String, Object> response = new HashMap<>();
        List<UserSearch> users = new ArrayList<>();
        for(String id:iDs){
            UserSearch user = userService.getOnline(id);
            users.add(user);
        }
        response.put("status",200);
        response.put("users",users);
        return response;
    }
    /**
     * 发送添加好友申请
     */
    @PostMapping("/post_add_apply")
    public Map<String,Object> addFriend(@RequestBody Map<String,Object> map){
        String from = (String) map.get("from");
        String to = (String) map.get("to");
        String msg = (String) map.get("msg");
        Notice notice= new Notice();
        notice.setFrom(from);
        notice.setTo(to);
        notice.setMsg(msg);
        notice.setType(0);
        Calendar now = Calendar.getInstance();
        notice.setTime(now.get(Calendar.MONTH)+1+"."+now.get(Calendar.DAY_OF_MONTH));
        Map<String, Object> response = new HashMap<>();
        if(from.equals(to)){
            response.put("status",100);
            response.put("msg","你不能加自己为好友！");
            return response;
        }
        Friend f = new Friend();
        f.setMe(Integer.valueOf(from));
        f.setFriend(Integer.valueOf(to));
        Friend friend = friendService.getByMeAndFriend(f);
        if(friend!=null){
            response.put("status",100);
            response.put("msg","他已经是你的好友了！");
            return response;
        }
        if(noticeService.getByFromAndTo(notice)!=null){
            response.put("status",100);
            response.put("msg","你已经向ta发送过请求了！");
            return response;
        }
        noticeService.insert(notice);
        response.put("status",200);
        return response;
    }
    /**
     * 获取系统消息，加好友信息
     */
    @PostMapping("/get_notice")
    public Map<String,Object> getNotice(@RequestBody Map<String,Object> map){
        String id = (String) map.get("id");
        List<NoticeQuery> notices = noticeService.getByFromOrTo(id);
        Map<String, Object> response = new HashMap<>();
        response.put("status",200);
        response.put("notices",notices);
        return response;
    }
    /**
     * 删除通知
     */
    @PostMapping("/delete_notice")
    public Map<String,Object> deleteNotice(@RequestBody Map<String,Object> map){
        String userId = (String) map.get("userId");
        String noticeId = (String) map.get("noticeId");
        Map<String, Object> response = new HashMap<>();
        if(userId.equals("")){
            response.put("status",100);
            response.put("msg","没有用户登录！");
            return response;
        }
        Notice notice = noticeService.getById(noticeId);
        if(notice==null){
            response.put("status",100);
            response.put("msg","没有找到数据！");
            return response;
        }
        if(notice.getType()==1||notice.getType()==2||notice.getType()==3){
            noticeService.deleteById(notice.getId().toString());
            response.put("status",200);
            return response;
        }
        //自己撤回
        if(notice.getType()==0&&notice.getFrom().equals(userId)){
            noticeService.deleteById(notice.getId().toString());
            response.put("status",200);
            return response;
        }
        // 删除验证信息
        Calendar now = Calendar.getInstance();
        Notice notice1 = new Notice();
        notice1.setTime(now.get(Calendar.MONTH)+1+"."+now.get(Calendar.DAY_OF_MONTH));
        notice1.setFrom(notice.getTo());
        notice1.setTo(notice.getFrom());
        notice1.setType(2);
        noticeService.deleteById(notice.getId().toString());
        noticeService.insert(notice1);
        response.put("status",200);
        return response;
    }
    /**
     * 同意好友申请
     */
    @PostMapping("/agree_apply")
    public Map<String,Object> agreeApply(@RequestBody Map<String,Object> map) {
        String userId = (String) map.get("userId");
        String noticeId = (String) map.get("noticeId");
        Map<String, Object> response = new HashMap<>();
        if(userId.equals("")){
            response.put("status",100);
            response.put("msg","没有用户登录！");
            return response;
        }
        Notice notice = noticeService.getById(noticeId);
        if(notice==null){
            response.put("status",100);
            response.put("msg","没有找到数据！");
            return response;
        }
        Friend friend1 = new Friend();
        Friend friend2 = new Friend();
        friend1.setMe(Integer.valueOf(notice.getFrom()));
        friend1.setFriend(Integer.valueOf(notice.getTo()));
        friend2.setMe(Integer.valueOf(notice.getTo()));
        friend2.setFriend(Integer.valueOf(notice.getFrom()));
        if(friendService.getByMeAndFriend(friend1)!=null){
            response.put("status",100);
            response.put("msg","对方已经是您的好友了！");
            noticeService.deleteById(noticeId);
            return response;
        }
        friendService.insert(friend1);
        friendService.insert(friend2);
        noticeService.deleteById(noticeId);
        Notice notice1 = new Notice();
        notice1.setType(1);
        notice1.setFrom(notice.getTo());
        notice1.setTo(notice.getFrom());
        Calendar now = Calendar.getInstance();
        notice1.setTime(now.get(Calendar.MONTH)+1+"."+now.get(Calendar.DAY_OF_MONTH));
        noticeService.insert(notice1);
        response.put("status",200);
        return response;
    }

    /**
     * 获取好友列表
     */
    @PostMapping("/get_friend_list")
    public Map<String,Object> getFriend(@RequestBody Map<String,Object> map){
        String id = (String) map.get("id");
        List<UserSearch> friends = userService.getFriendList(id);
        Map<String, Object> response = new HashMap<>();
        response.put("status",200);
        response.put("friends",friends);
        return response;
    }
    /**
     * 获取聊天信息
     */
    @PostMapping("/get_message")
    public Map<String,Object> getMessage(@RequestBody Map<String,Object> map){
        String me = (String) map.get("me");
        String friend = (String) map.get("friend");
        Map<String, Object> response = new HashMap<>();
        if(me.equals("")||friend.equals("")){
            response.put("status",100);
            response.put("msg","获取信息出错！");
            return response;
        }
        Friend f = new Friend(null,Integer.valueOf(me),Integer.valueOf(friend));
        List<Message> messages = messageService.getMessages(f);
        response.put("status",200);
        response.put("messages",messages);
        return response;
    }
    /**
     * 保存聊天记录
     */
    @PostMapping("/send_message")
    public Map<String,Object> sendMessage(@RequestBody Map<String,Object> map){
        String from = (String) map.get("from");
        String to = (String) map.get("to");
        String content = (String) map.get("content");
        Map<String, Object> response = new HashMap<>();
        if(from.equals("")||to.equals("")){
            response.put("status",100);
            response.put("msg","获取信息出错！");
            return response;
        }
        Message message = new Message(null,Integer.valueOf(from),Integer.valueOf(to),content);
        messageService.insert(message);
        response.put("status",200);
        return response;
    }
    /**
     * 清除聊天记录
     */
    @PostMapping("/clear_record")
    public Map<String,Object> clearMessage(@RequestBody Map<String,Object> map){
        String me = (String) map.get("me");
        String friend = (String) map.get("friend");
        Map<String, Object> response = new HashMap<>();
        if(me.equals("")||friend.equals("")){
            response.put("status",100);
            response.put("msg","获取信息出错！");
            return response;
        }
        Friend f = new Friend(null,Integer.valueOf(me),Integer.valueOf(friend));
        messageService.deleteByMeAndFriend(f);
        response.put("status",200);
        return response;
    }
    /**
     * 删除好友
     */
    @PostMapping("/delete_friend")
    public Map<String,Object> deleteFriend(@RequestBody Map<String,Object> map){
        String me = (String) map.get("me");
        String friend = (String) map.get("friend");
        Map<String, Object> response = new HashMap<>();
        if(me.equals("")||friend.equals("")){
            response.put("status",100);
            response.put("msg","获取信息出错！");
            return response;
        }
        Friend f = new Friend(null,Integer.valueOf(me),Integer.valueOf(friend));
        //删除好友记录
        friendService.deleteFriend(f);
        //删除聊天信息
        messageService.deleteByMeAndFriend(f);
        Calendar now = Calendar.getInstance();
        Notice notice1 = new Notice();
        notice1.setTime(now.get(Calendar.MONTH)+1+"."+now.get(Calendar.DAY_OF_MONTH));
        notice1.setFrom(me);
        notice1.setTo(friend);
        notice1.setType(3);
        noticeService.insert(notice1);
        response.put("status",200);
        return response;
    }
    /**
     * 获取大厅聊天记录
     */
    @PostMapping("/get_lobby_messages")
    public Map<String,Object> getLobbyMessage(){
        Map<String, Object> response = new HashMap<>();
        response.put("status",200);
        response.put("messages",lobbyService.getAll());
        return response;
    }
    /**
     * 插入一条聊天室的记录
     */
    @PostMapping("/send_lobby_message")
    public Map<String,Object> sendLobby(@RequestBody Map<String,Object> map){
        String name = (String) map.get("name");
        String url = (String) map.get("url");
        String time = (String) map.get("time");
        String content = (String) map.get("content");
        Map<String, Object> response = new HashMap<>();
        if(name.equals("")){
            response.put("status",100);
            response.put("msg","没有用户id/name");
            return response;
        }
        Lobby lobby = new Lobby(null,name,url,time,content);
        lobbyService.insert(lobby);
        response.put("status",200);
        return response;
    }
}
