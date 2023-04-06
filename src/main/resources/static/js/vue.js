let id = sessionStorage.getItem("id");
let socket;//好友之间发送消息的服务器
let socket1;//发送大厅消息的服务器
let myDate = new Date();
let url = "localhost:8084";//socket接口配置
let app = new Vue({
        el:"#app",
        data:{
                user_id :-1,
                my_nickname : "",
                my_email:"",
                my_signature:"",
                my_phone:"",
                my_sex:"",
                my_birthday:"",
                nickname_edit:"",
                sex_edit:"",
                birthday_edit:"",
                phone_edit:"",
                signature_edit:"",
                profile_url:"",
                register_time:"",
                old_pw:"",
                new_pw:"",
                notices:[],//系统通知
                chat_window:false,
                notice_check:true,//通知提醒
                new_friend_keyword:"",
                new_users:[],
                online_users:[],//在线用户
                online_ids:"",
                add_friend_panel:false,//加好友面板
                add_who:"",//加谁
                add_msg:"",//验证消息
                friends:[],//我的好友列表
                chatting_with:-1,//当前聊天窗口
                messages_show:[],//控制显示聊天记录的
                typing_text:"",//待发送的消息
                profile_show:false,
                chat_show:false,
                images:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],//可选头像
                lobby_window:false,//大厅的聊天窗口
                lobby_messages:[],//大厅聊天记录
                lobby_number:0,//记录大厅在线的人数
                lobby_text_typing:"",//
                group_images:[1,2,3,4],//群聊头像
                selected_group_url:"/images/group-1.png",//默认群头像
                create_group_panel:false,//是否显示创建群聊，默认不显示
                creating_group_name:"",//创建的群的名字
                my_groups:[],//我的群聊
                lobby_or_group:false,//当前显示的是公共聊天室还是群聊
                chatting_group_index:-1,//当前正在聊天的群聊的索引
                group_info_panel:false,//群详情面板显示
                group_members:[],//群成员显示
                invite_friend_panel:false,//邀请好友入群
                friend_or_group:false,//搜索群聊还是好友
                new_group_keyword:"",//搜索群聊的关键词
                group_search_result:[],//群聊搜索结果
                create_or_update:false,//新建群还是修改群
        },
        methods:{
                //弹出框提示

                toastMsg(msg) {
                        if ($("div").is("#toastMessage")) {  // 判断页面是否存在  存在的话删除
                                $("#toastMessage").remove();
                        }
                        var msgDiv = '<div id="toastMessage" class="toast-message">' +
                            '<span>' + msg + '</span>' +
                            '</div>';
                        $("body").append(msgDiv); //再添加上去替代
                        var screenHeight = window.innerHeight;  //获取窗口的高
                        var toastMessage = $("#toastMessage");
                        var toastHeight = toastMessage.height();
                        var top = "65px";
                        toastMessage.css("top", top);    //垂直居中显示
                        setTimeout(function () {    // 设置消失时间
                                $("#toastMessage").remove();
                        }, 2500);
                },
                //修改群资料
                update_group_info(){
                        if(this.my_groups[this.chatting_group_index].owner_id.toString()!==this.user_id.toString()){
                                alert("只有群主才能进行此操作！");
                                return;
                        }
                        this.creating_group_name = this.my_groups[this.chatting_group_index].name;
                        this.selected_group_url = this.my_groups[this.chatting_group_index].url;
                        this.create_or_update = true;
                        this.create_group_panel = !this.create_group_panel;//显示修改面板
                },
                //踢人
                tick_out(id){
                        if(this.my_groups[this.chatting_group_index].owner_id.toString()!==this.user_id.toString()){
                                alert("只有群主才能进行此操作！");
                                return;
                        }
                        if(this.user_id.toString()===id.toString()){
                                alert("您不能踢自己");
                                return;
                        }
                        let r =confirm("是否将该用户踢出群聊？");
                        if(r){
                                let that = this;
                                axios.post('/tick_out',{
                                        group_id:that.my_groups[that.chatting_group_index].id.toString(),
                                        member_id:id.toString()
                                }).then(function (response) {
                                        if(response.data.status===200){
                                                alert("操作成功！");
                                                window.location.reload();
                                        }else{
                                                alert("操作失败！");
                                        }
                                }).catch(function (e) {
                                        console.log(e);
                                });
                        }
                },
                //退出群聊
                quit_group(){
                        if(this.my_groups[this.chatting_group_index].owner_id.toString()===this.user_id.toString()){
                                alert("您是群主,退出之后群聊将解散!");
                                this.delete_group();
                        }
                        else {
                                let r =confirm("是否退出群聊？");
                                if(r){
                                        let that = this;
                                        axios.post('/quit_group',{
                                                group_id:that.my_groups[that.chatting_group_index].id.toString(),
                                                member_id:that.user_id
                                        }).then(function (response) {
                                                if(response.data.status===200){
                                                        alert("操作成功！");
                                                        window.location.reload();
                                                }else{
                                                        alert("操作失败！");
                                                }
                                        }).catch(function (e) {
                                                console.log(e);
                                        });
                                }
                        }
                },
                //解散群聊
                delete_group(){
                        if(this.my_groups[this.chatting_group_index].owner_id.toString()!==this.user_id.toString()){
                                alert("只有群主才能进行此操作！");
                                return;
                        }
                        let r =confirm("是否解散群聊？");
                        if(r){
                                let that = this;
                                axios.post('/delete_group',{
                                        id:that.my_groups[that.chatting_group_index].id.toString()
                                }).then(function (response) {
                                        if(response.data.status===200){
                                                alert("操作成功！");
                                                window.location.reload();
                                        }else{
                                                alert("操作失败！");
                                        }
                                }).catch(function (e) {
                                        console.log(e);
                                });
                        }
                },
                //清除群聊天记录
                clear_group_messages(){
                        if(this.my_groups[this.chatting_group_index].owner_id.toString()!==this.user_id.toString()){
                                alert("只有群主才能进行此操作！");
                                return;
                        }
                        let r =confirm("是否清除该群的所有聊天记录？");
                        if(r){
                                let that = this;
                                axios.post('/clear_group_messages',{
                                        id:that.my_groups[that.chatting_group_index].id.toString()
                                }).then(function (response) {
                                        if(response.data.status===200){
                                                alert("操作成功！");
                                                that.my_groups[that.chatting_group_index].lastMessage = "";
                                                that.my_groups[that.chatting_group_index].messages=[];
                                        }else{
                                                alert("操作失败！");
                                        }
                                }).catch(function (e) {
                                        console.log(e);
                                });
                        }
                },
                //申请加入群聊
                apply_into_group(id){
                        let that = this;
                        axios.post('/invite_friend',{
                                group_id:id.toString(),
                                member_id:that.user_id.toString()
                        }).then(function (response) {
                                if(response.data.status===200){
                                        alert("加入群聊成功！");
                                        that.get_my_groups();//重新加载一下群聊
                                }else{
                                        alert("你已经在这个群里了！");
                                }
                        }).catch(function (e) {
                                console.log(e);
                        })
                },
                //搜索群聊
                search_group(){
                        if(this.new_group_keyword===""){
                                return;
                        }
                        let that = this;
                        axios.post('/search_group',{
                                keyword:that.new_group_keyword
                        }).then(function (response) {
                                if(response.data.status===200){
                                        that.group_search_result = response.data.groups;
                                }
                        }).catch(function (e) {
                                console.log(e);
                        });
                },
                //显示搜索群聊还是搜索好友
                change_friend_or_group(){
                        this.friend_or_group = !this.friend_or_group;
                },
                invite_friend_into_group(id){
                        let that = this;
                        axios.post('/invite_friend',{
                                member_id:id.toString(),
                                group_id:that.my_groups[that.chatting_group_index].id.toString()
                        }).then(function (response) {
                                if(response.data.status===200){
                                        alert("成功邀请好友入群！");
                                }else{
                                        alert(response.data.msg);
                                }
                        }).catch(function (e) {
                                console.log(e);
                        })
                },
                //显示邀请好友入群
                change_invite_friend_panel(){
                        this.group_info_panel = false;
                        this.invite_friend_panel = !this.invite_friend_panel;
                },
                change_group_info_panel(){
                  let that = this;
                  axios.post('/get_group_members',{
                          id:that.my_groups[that.chatting_group_index].id.toString()
                  }).then(function (response) {
                          if(response.data.status===200){
                                  that.group_members = response.data.members;
                          }
                  }).catch(function (error) {
                          console.log(error);
                  });
                  this.group_info_panel = !this.group_info_panel;
                },
                //打开群聊聊天框
                open_group_chat(index){
                        this.chatting_group_index = index;
                        this.lobby_or_group = true;//确保切换到群聊状态
                        this.close_chat_window();//确保关闭了其他的聊天窗口
                        this.lobby_window = true;
                        this.lobby_text_typing = "";//清除待发信息
                        this.scroll();//划到底部
                },
                //获取群聊的聊天记录
                get_group_messages(){
                        let that = this;
                   for(let i=0;i<that.my_groups.length;i++){
                           axios.post('/get_group_messages',{
                                   id:that.my_groups[i].id.toString()//群聊id
                           }).then(function (response) {
                                   if(response.data.status===200){
                                           that.my_groups[i].messages = response.data.messages;//
                                           if(messages.length>0)
                                                that.my_groups[i].lastMessage = messages[messages.length-1].member_name+":"+messages[messages.length-1].content;//显示最新一条消息
                                   }
                           }).catch(function (error) {
                                   console.log(error);
                           })
                   }
                },
                //将群聊的成员id放到数组里
                put_group_member_id_in_array(){
                  for(let i=0;i<this.my_groups.length;i++){
                        let that = this;
                        axios.post('/get_members_id',{
                                group_id:that.my_groups[i].id.toString()
                        }).then(function (response) {
                                if(response.data.status===200){
                                        that.my_groups[i].ids=response.data.ids;
                                }
                        }).catch(function (e) {
                                console.log(e);
                        })
                  }
                },
                //获取我的群聊
                get_my_groups(){
                        let that = this;
                        axios.post('/get_my_group',{
                                id:that.user_id,
                        }).then(function (response) {
                                if(response.data.status===200){
                                        that.my_groups = [];//先清空一下群列表
                                        that.my_groups[-1] = {url:"",messages:[]};//防止切换群聊时头像出错的问题
                                        let groups = response.data.groups;
                                        for(let i = 0;i<groups.length;i++){
                                                let group = groups[i];
                                                that.my_groups.push(group);
                                        }
                                        that.get_group_messages();//获取群聊消息
                                        that.put_group_member_id_in_array();//获取成员ids
                                }
                        }).catch(function (error) {
                                console.log(error);
                        })
                },
                //提交建群请求
                create_group_post(){
                        if(this.creating_group_name===""){
                                alert("群名字不能为空哦！");
                                return;
                        }
                        if(this.create_or_update){//修改群聊
                                let that = this;
                                axios.post('/update_group',{
                                        id:that.my_groups[that.chatting_group_index].id.toString(),
                                        name:that.creating_group_name,
                                        url:that.selected_group_url
                                }).then(function (response) {
                                        if(response.data.status===200){
                                                alert("修改成功！");
                                                that.get_my_groups();//重新获取群组信息
                                                that.change_create_group_panel();//关闭
                                        }
                                })
                        }else{//创建群聊
                                let that = this;
                                axios.post('/create_group',{
                                        id:that.user_id.toString(),
                                        name:that.creating_group_name,
                                        url:that.selected_group_url
                                }).then(function (response) {
                                        if(response.data.status===200){
                                                alert("创建群聊成功！");
                                                that.change_create_group_panel();//关闭
                                                that.get_my_groups();//重新获取群组信息
                                        }
                                })
                        }
                },
                //显示与不显示新建群聊面板
                change_create_group_panel(){
                        this.creating_group_name = "";
                        this.create_or_update = false;
                        this.create_group_panel = !this.create_group_panel;
                },
                // 选择群头像
                select_group_image(index){
                        this.selected_group_url = "/images/group-"+index+".png";
                },
                send_lobby_message(){
                        if(this.lobby_text_typing===""){
                                alert('不能发送空消息！');
                                return;
                        }
                        let timeNow = (myDate.getMonth()+1)+"月"+myDate.getDate()+"日 "+myDate.getHours()+":"+myDate.getMinutes();
                        //发送公共聊天室消息
                        if(!this.lobby_or_group){
                                //通过web socket对方发送时时消息
                                let message = {name:this.user_id+"|"+this.my_nickname,url:this.profile_url,time:timeNow,content:this.lobby_text_typing,type:2,}
                                socket1.send(JSON.stringify(message));
                                //显示到本地
                                let msg = [];
                                msg.type = 'out';
                                msg.content = this.lobby_text_typing;
                                msg.name = this.my_nickname;
                                msg.url = this.profile_url;
                                msg.time = timeNow;
                                this.lobby_messages.push(msg);
                                this.scroll();
                                //将消息保存到数据库
                                let that = this;
                                axios.post('/send_lobby_message',{
                                        name:that.user_id+"|"+that.my_nickname,
                                        url:that.profile_url,
                                        content:that.lobby_text_typing,
                                        time:timeNow
                                }).then(function (response) {
                                        if(response.data.status===200)
                                        {
                                                that.lobby_text_typing = "";
                                        }else
                                                console.log(response.data.msg);
                                }).catch(function () {
                                        console.log("axios请求出错！code 12");
                                })
                        }
                        //发送群聊消息
                        else
                        {
                                //通过web socket对方发送时时消息
                                let ids = this.my_groups[this.chatting_group_index].ids;
                                let message = {type:3,
                                        content:this.lobby_text_typing,
                                        time:timeNow,
                                        from:this.user_id,
                                        name:this.my_nickname,
                                        url:this.profile_url,
                                        ids:ids,
                                        group_id:this.my_groups[this.chatting_group_index].id
                                };
                                socket.send(JSON.stringify(message));
                                //显示到本地
                                let msg = [];
                                msg.member_id = this.user_id;
                                msg.content = this.lobby_text_typing;
                                msg.member_name = this.my_nickname;
                                msg.member_url = this.profile_url;
                                msg.time = timeNow;
                                this.my_groups[this.chatting_group_index].messages.push(msg);
                                //将消息保存到数据库
                                let that = this;
                                axios.post('/send_group_message',{
                                        group_id:that.my_groups[that.chatting_group_index].id.toString(),
                                        member_id:that.user_id.toString(),
                                        content:that.lobby_text_typing,
                                        time:timeNow
                                }).then(function (response) {
                                        if(response.data.status===200)
                                        {
                                                that.my_groups[that.chatting_group_index].lastMessage=that.my_nickname+":"+that.lobby_text_typing;
                                                that.lobby_text_typing = "";
                                                that.scroll();
                                        }else
                                                console.log(response.data.msg);
                                }).catch(function (error) {
                                        console.log(error);
                                })
                        }
                },
                open_lobby_window(index){
                        this.lobby_or_group = false;//确保切换到大厅状态
                        this.close_chat_window();//确保关闭了其他的聊天窗口
                       this.lobby_window = true;
                       this.lobby_text_typing = "";//清除待发信息
                        this.scroll();//划到底部
                },
                close_lobby_window(){
                        this.lobby_window = false;
                },
                //获取大厅聊天记录
                get_lobby_messages(){
                        let that = this;
                        axios.post('/get_lobby_messages',{}).then(function (response) {
                                if(response.data.status===200){
                                        let messages = response.data.messages;
                                        for(let i=0;i<messages.length;i++){
                                                let message = [];
                                                let n = messages[i].name.substr(0,messages[i].name.lastIndexOf("|"));
                                                message.type = n==that.user_id?'out':'in';
                                                message.content = messages[i].content;
                                                if(messages[i].name.substr(0,2)==="游客")
                                                {
                                                        message.name = messages[i].name.substr(2,messages[i].name.lastIndexOf("(")-2)+"(游客)";
                                                }else{
                                                        message.name = messages[i].name.substr(messages[i].name.lastIndexOf("|")+1,messages[i].name.length-messages[i].name.lastIndexOf("|")+1);
                                                }
                                                message.url = messages[i].url;
                                                message.time = messages[i].time;
                                                that.lobby_messages.push(message);
                                        }
                                }else
                                {
                                        console.log('获取大厅消息列表出错！');
                                }
                        }).catch(function () {
                                console.log("axios请求出错！code 15");
                        })
                },
                //更换头像
                change_profile(index){
                        let that = this;
                        let url1 = '/images/user-'+index+'.png';
                        axios.post('/change_profile',
                            {id:that.user_id, url: url1
                            }).then(function (response) {
                                if(response.data.status===200)
                                {
                                        that.profile_url = url1;
                                        alert('更换成功！');
                                }else
                                        alert(response.data.msg);
                        }).catch(function () {
                                console.log("axios请求出错！code 14");
                        })
                },
                //注销登录
                logout(){
                        let r = confirm('是否注销登录？');
                        if(r){
                                sessionStorage.removeItem("id");
                                window.location.href="/logout";
                        }
                },

                //删除好友
                delete_friend(){
                        if(this.chatting_with===-1){
                                alert('请先选择对象！');
                                return;
                        }
                        let r = confirm('是否删除该好友？');
                        if(r){
                                let that = this;
                                axios.post('/delete_friend',{
                                        me:that.user_id,
                                        friend:that.friends[that.chatting_with].id.toString(),
                                }).then(function (response) {
                                        if(response.data.status===200)
                                        {
                                                alert('操作成功！');
                                                let message = {to:that.friends[that.chatting_with].id.toString(),type:6}
                                                socket.send(JSON.stringify(message));
                                                that.close_chat_window();
                                                that.get_friend_list();//重新获取好友列表
                                        }else
                                                alert(response.data.msg);
                                }).catch(function () {
                                        console.log("axios请求出错！code 13");
                                })
                        }
                },
                //清除聊天记录
                clear_message_record(){
                        if(this.chatting_with===-1){
                                alert('请先选择对象！');
                                return;
                        }
                        let r = confirm('是否清除全部聊天记录？');
                        if(r){
                                let that = this;
                                axios.post('/clear_record',{
                                        me:that.user_id,
                                        friend:that.friends[that.chatting_with].id.toString(),
                                }).then(function (response) {
                                        if(response.data.status===200)
                                        {
                                               alert('操作成功！');
                                               window.location.reload();
                                        }else
                                                alert(response.data.msg);
                                }).catch(function () {
                                        console.log("axios请求出错！code 13");
                                })
                        }
                },
                //打开信息主页
                open_my_profile_window(){
                        this.chatting_with = -1;
                        this.chat_window = false;
                        this.profile_show = true;
                },
                open_profile_window(){
                        this.chat_window = false;
                        this.profile_show = true;
                },
                //关闭信息主页
                close_profile_window(){
                        this.profile_show = false;
                        this.chat_window = this.chatting_with !== -1;
                },
                //发送消息
                send_message(){
                        if(this.typing_text===""){
                                alert('不能发送空消息！');
                                return;
                        }
                        if(this.chatting_with===-1){
                                alert('请先选择对象！');
                                return;
                        }
                        //通过web socket对方发送时时消息
                        let message = {from:this.user_id,to:this.friends[this.chatting_with].id.toString(),text:this.typing_text,type:1}
                        socket.send(JSON.stringify(message));
                        //显示到本地
                        let msg = [];
                        msg.type = 'out';
                        msg.content = this.typing_text;
                        this.friends[this.chatting_with].lastChat = this.typing_text;
                        this.friends[this.chatting_with].lastChatTime = myDate.getHours()+":"+myDate.getMinutes();
                        this.friends[this.chatting_with].messages.push(msg);
                        this.scroll();
                        //将消息保存到数据库
                        let that = this;
                        axios.post('/send_message',{
                                from:that.user_id,
                                to:that.friends[that.chatting_with].id.toString(),
                                content:that.typing_text
                        }).then(function (response) {
                                if(response.data.status===200)
                                {
                                        that.typing_text = "";
                                }else
                                        console.log(response.data.msg);
                        }).catch(function () {
                                console.log("axios请求出错！code 12");
                        })
                        
                },
                //获取聊天信息
                get_message(){
                          let that = this;
                          for(let i=0;i<that.friends.length;i++){
                                  axios.post('/get_message',{
                                          me:that.user_id,
                                          friend:that.friends[i].id.toString()
                                  }).then(function (response) {
                                          if(response.data.status===200){
                                                  let messages = response.data.messages;
                                                  for(let j=0;j<messages.length;j++){
                                                          let message = [];
                                                          message.type = messages[j].from==that.user_id?'out':'in';
                                                          message.content = messages[j].content;
                                                          that.friends[i].messages.push(message);
                                                          that.friends[i].lastChat = messages[j].content;
                                                  }
                                          }else
                                          {
                                                  console.log('获取消息列表出错！');
                                          }
                                  }).catch(function () {
                                          console.log("axios请求出错！code 11");
                                  })
                          }
                },
                //获取好友列表
                get_friend_list(){
                        let that = this;
                        axios.post('/get_friend_list',{
                                id:that.user_id
                        }).then(function (response) {
                                if(response.data.status===200)
                                {
                                        that.friends = [];//先清空
                                        let friends = response.data.friends;
                                        for(let i=0;i<friends.length;i++){
                                                let friend = [];
                                                friend.id = friends[i].id;
                                                friend.nickname = friends[i].nickname;
                                                friend.email = friends[i].email;
                                                friend.url = friends[i].url;
                                                friend.sex = friends[i].sex;
                                                friend.phone = friends[i].phone;
                                                friend.signature = friends[i].signature;
                                                friend.birthday = friends[i].birthday;
                                                friend.messages = [];// 聊天信息列表
                                                friend.lastChatTime = "";//上一次聊天时间
                                                friend.lastChat = "";//最后一句话
                                                friend.uncheck = 0;//未读消息
                                                that.friends.push(friend);
                                        }
                                        that.get_message();
                                }
                                else {
                                        alert("获取好友列表失败！"+response.data.msg);
                                }
                        }).catch(function () {
                                console.log("axios请求出错！code 10");
                        })
                },
                //同意好友请求
                agree_apply(id,to){
                        let that = this;
                        axios.post('/agree_apply',{
                                userId:that.user_id,
                                noticeId:id.toString()
                        }).then(function (response) {
                                if(response.data.status===200)
                                {
                                        alert("操作成功！");
                                        that.get_notice();//重新获取通知信息
                                        that.get_friend_list();//重新加载好友列表
                                        let message = {name:that.my_nickname,from:that.user_id.toString(),to:to.toString(),type:4}//也通知好友更新列表信息
                                        socket.send(JSON.stringify(message));
                                }
                                else {
                                        alert("操作失败！"+response.data.msg);
                                }
                        }).catch(function () {
                                console.log("axios请求出错！code 9");
                        })
                },
                //删除系统消息
                delete_notice(id,to){
                        let that = this;
                        axios.post('/delete_notice',{
                                userId:that.user_id,
                                noticeId:id.toString()
                        }).then(function (response) {
                                if(response.data.status===200)
                                {
                                        alert("操作成功！");
                                        let message = {to:to.toString(),type:5}
                                        socket.send(JSON.stringify(message));
                                        that.get_notice();
                                }
                                else {
                                        alert("操作失败！"+response.data.msg);
                                        that.get_notice();
                                }
                        }).catch(function () {
                                that.get_notice();
                                console.log("axios请求出错！code 8");
                        })
                },
                //获取系统消息
                get_notice(){
                        this.notices = [];
                        let that = this;
                        axios.post('/get_notice',{
                                id:that.user_id,
                        }).then(function (response){
                                if(response.data.status===200){
                                        let notices = response.data.notices;
                                        for(let i =0;i<notices.length;i++){
                                                let notice = [];
                                                //我的申请信息
                                                if (notices[i].from==that.user_id){
                                                        if(notices[i].type==0){
                                                                notice.id=notices[i].id;
                                                                notice.type="等待验证";
                                                                notice.content = '您于'+notices[i].time+"向"+notices[i].toName+"发送的好友申请在等待验证...";
                                                                notice.time = notices[i].time;
                                                                notice.to = notices[i].to;
                                                                that.notices.push(notice);
                                                        }
                                                }else if(notices[i].to==that.user_id){
                                                        notice.id=notices[i].id;
                                                        if(notices[i].type==0){
                                                                notice.type="好友验证";
                                                                notice.from = notices[i].from;
                                                                notice.content = notices[i].toName+"于"+notices[i].time+"向你发起好友申请 验证信息:"+notices[i].msg;
                                                                notice.time = notices[i].time;
                                                        }else if(notices[i].type==1)
                                                        {
                                                                notice.type="验证成功";
                                                                notice.content = notices[i].toName+"于"+notices[i].time+"同意了您的好友申请";
                                                                notice.time = notices[i].time;
                                                        }else if(notices[i].type==2){
                                                                notice.type="拒绝信息";
                                                                notice.content = notices[i].toName+"于"+notices[i].time+"拒绝了您的好友申请";
                                                                notice.time = notices[i].time;
                                                        }else if(notices[i].type==3){
                                                                notice.type="删除通知";
                                                                notice.content = notices[i].toName+"于"+notices[i].time+"将你移除了好友列表";
                                                                notice.time = notices[i].time;
                                                        }
                                                        that.notices.push(notice);
                                                }

                                        }
                                }
                                else{
                                        alert("发送失败！");
                                }
                                that.close_add_friend_panel();
                        }).catch(function () {
                                console.log("axios请求出错！code 3");
                        })
                },
                //发送加好友申请
                post_add_apply(){
                        let that = this;
                        axios.post('/post_add_apply',{
                                from:that.user_id,
                                to:that.add_who.toString(),
                                msg:that.add_msg,
                        }).then(function (response){
                                if(response.data.status===200){
                                        //用socket同步给在线的用户
                                        let message = {to:that.add_who.toString(),type:5}
                                        socket.send(JSON.stringify(message));
                                        alert("发送成功！");
                                        that.get_notice();
                                }
                                else if(response.data.status===100){
                                        alert("发送失败"+response.data.msg);
                                }
                                else{
                                        alert("发送失败！");
                                }
                                that.close_add_friend_panel();
                        }).catch(function () {
                                console.log("axios请求出错！code 2");
                        })
                },
                show_add_friend_panel(id){
                        this.group_info_panel = false;
                        this.add_who = id;
                        this.add_friend_panel=true;
                },
                close_add_friend_panel(){
                        this.add_who = "";
                        this.add_friend_panel = false;
                },
                clear_notice(){
                        this.notice_check = false;
                },
                //滚动到聊天位置末尾
                scroll() {
                        this.$nextTick(()=>{
                                let container = this.$el.querySelector('#chat-body');
                                container.scrollTop = container.scrollHeight;
                                let container1 = this.$el.querySelector('#lobby-chat-body');
                                container1.scrollTop = container1.scrollHeight;
                        })
                },
                open_chat_window(index){
                        this.chatting_with = index;
                        this.messages_show = this.friends[index].messages;
                        this.chat_window = true;
                        this.friends[index].uncheck = 0;
                        this.lobby_window = false;//确保关闭了大厅
                        this.scroll();//划到底部
                },
                close_chat_window(){
                        this.friends[-1] = {url: "/images/normal.png"};
                        this.chatting_with = -1;
                        this.chat_window = false;
                },
                search_user(){
                        let that = this;
                        axios.post('/search_user',{
                                id:that.user_id,
                                keyword:that.new_friend_keyword
                        }).then(function (response){
                                if(response.data.status===200){
                                        let users = response.data.users;
                                        that.new_users = [];
                                        for(let i=0;i<users.length;i++){
                                                let user = [];
                                                user.id = users[i].id;
                                                user.nickname = users[i].nickname;
                                                user.email = users[i].email;
                                                user.url = users[i].url;
                                                that.new_users.push(user);
                                        }
                                }else if(response.data.status===100){
                                        that.new_users = [];
                                }
                                else{
                                        alert("搜索出错！");
                                }
                        }).catch(function () {
                                console.log("axios请求出错！code 4");
                        })
                },
                get_my_info(){
                        let that = this;
                        axios.post('/get_my_info',{
                                id:that.user_id
                        }).then(function (response){
                                if(response.data.status===200){
                                        that.nickname_edit = that.my_nickname = response.data.user.nickname;
                                        that.my_email = response.data.user.email;
                                        that.sex_edit = that.my_sex=response.data.user.sex;
                                        that.phone_edit = that.my_phone =  response.data.user.phone;
                                        that.birthday_edit = that.my_birthday = response.data.user.birthday;
                                        that.signature_edit = that.my_signature = response.data.user.signature;
                                        that.profile_url = response.data.user.url;
                                        that.register_time = response.data.user.register_time;
                                }
                                else{
                                        alert("用户信息已失效，请重新登录！");
                                        window.location.href="/logout";
                                }
                        }).catch(function () {
                                console.log("axios请求出错！code 5");
                        })
                },
                update_my_info(){
                        let that = this;
                        axios.post('/update_my_info',{
                                id:that.user_id,
                                nickname:that.nickname_edit,
                                sex:that.sex_edit,
                                birthday:that.birthday_edit,
                                phone:that.phone_edit,
                                signature:that.signature_edit
                        }).then(function (response){
                                if(response.data.status===200){
                                        that.my_nickname = that.nickname_edit;
                                        that.my_phone = that.phone_edit;
                                        that.my_birthday = that.birthday_edit;
                                        that.my_signature = that.signature_edit;
                                        alert("修改成功！");
                                }
                                else{
                                        alert("获取用户信息出错！");
                                }
                        }).catch(function () {
                                console.log("axios请求出错！code 6");
                        })
                },
                change_password(){
                        if(this.old_pw===""||this.new_pw===""){
                                alert("不允许为空！");
                                return;
                        }
                        let that = this;
                        axios.post('/change_password',{
                                id:that.user_id,
                                old_pw:that.old_pw,
                                new_pw: that.new_pw
                        }).then(function (response){
                                if(response.data.status===200){
                                        that.old_pw="";
                                        that.new_pw="";
                                        alert("修改成功！");
                                }
                                else if(response.data.status===100){
                                        alert(response.data.msg);
                                }
                                else{
                                        alert("获取用户信息出错！");
                                }
                        }).catch(function () {
                                console.log("axios请求出错！code 7");
                        })
                },
                get_online_user(){
                        let that = this;
                        axios.post('/get_online',{
                                ids:that.online_ids
                        }).then(function (response){
                                if(response.data.status===200){
                                        let users = response.data.users;
                                        that.online_users = [];
                                        for(let i=0;i<users.length;i++){
                                                let user = [];
                                                user.id = users[i].id;
                                                user.nickname = users[i].nickname;
                                                user.email = users[i].email;
                                                user.url = users[i].url;
                                                that.online_users.push(user);
                                        }
                                }else if(response.data.status===100){
                                        that.online_users = [];
                                }
                                else{
                                        alert("搜索出错！");
                                }
                        }).catch(function () {
                                console.log("axios请求出错！code 1");
                        })
                },
                get_index_of_friend(id){
                  for(let i=0;i<this.friends.length;i++){
                          if(this.friends[i].id==id){
                                  return i;
                          }
                  }
                  return -1;
                },
                get_group_index(id){
                        for(let i=0;i<this.my_groups.length;i++){
                                if(this.my_groups[i].id===id){
                                        return i;
                                }
                        }
                        return -1;
                },
                socket_init(){
                        let that = this;
                        if(typeof (WebSocket) == "undefined"){
                                console.log("您的浏览器不支持websocket");
                        }else{
                                let socketUrl = "ws://"+url+":8084/socket/"+this.user_id;
                                if(socket!=null){
                                        socket.close();
                                        socket = null;
                                }
                                socket = new WebSocket(socketUrl);
                                //打开事件
                                socket.onopen = function () {
                                        console.log("websocket已经打开");
                                }
                                //获取消息事件.
                                socket.onmessage = function (msg) {
                                        let data = JSON.parse(msg.data);
                                        if(data.type===-1){
                                                alert("您的账户已在别处登录!");
                                                sessionStorage.removeItem("id");
                                                window.location.href="/logout";
                                        }
                                        else if(data.type===0)//用户登录提醒
                                        {
                                                let notice = [];
                                                notice.type="登录提醒";
                                                notice.content = '您于'+data.time+"登录OICQ";
                                                notice.time = myDate.getHours()+':'+myDate.getMinutes();
                                                that.notices.push(notice);
                                                that.toastMsg(that.my_nickname+",欢迎登录OICQ！");
                                        }else if(data.type===1)
                                        {
                                                that.online_ids = data.ids;
                                                that.get_online_user();
                                        }else if(data.type===2){
                                                let msg = [];
                                                msg.type = 'in';
                                                msg.content = data.text;
                                                let index = that.get_index_of_friend(data.from);
                                                if(index!==-1){
                                                        that.friends[index].messages.push(msg);
                                                        that.friends[index].lastChat = data.text;
                                                        that.friends[index].lastChatTime = myDate.getHours()+":"+myDate.getMinutes();
                                                        if(index!==that.chatting_with) that.friends[index].uncheck++;
                                                        that.toastMsg("你收到一条来自好友@"+that.friends[index].nickname+"@的消息");
                                                }
                                                that.scroll();
                                        }else if(data.type===3){//接受群聊消息
                                                //显示到本地
                                                let msg = {id:-1,group_id:parseInt(data.group_id),member_id:parseInt(data.from),
                                                                content:data.content,time:data.time,member_url:data.url};
                                                // msg.member_id = parseInt(data.from);
                                                // msg.content = data.content;
                                                // msg.member_name = data.name;
                                                // msg.member_url = data.url;
                                                // msg.time = data.time;
                                                let index = that.get_group_index(parseInt(data.group_id));//获取群聊的index
                                                that.my_groups[index].messages.push(msg);
                                                that.my_groups[index].lastMessage = data.name+":"+data.content;
                                                that.toastMsg("你收到一条来自群聊@"+that.my_groups[index].name+"@的消息");
                                                //通过post请求重新获取聊天记录，但是这样做的代价很大
                                                // axios.post('/get_group_messages',{
                                                //         id:data.group_id.toString()//群聊id
                                                // }).then(function (response) {
                                                //         if(response.data.status===200){
                                                //                 that.my_groups[index].messages = response.data.messages;//
                                                //                 if(messages.length>0)
                                                //                         that.my_groups[index].lastMessage = messages[messages.length-1].member_name+":"+messages[messages.length-1].content;//显示最新一条消息
                                                //         }
                                                // }).catch(function (error) {
                                                //         console.log(error);
                                                // })
                                                that.scroll();
                                        }else if(data.type===4){
                                                that.toastMsg("用户@"+data.name+"@同意了你的好友申请！");
                                                that.get_notice();//刷新一下系统通知
                                                that.notice_check = true;
                                                that.close_chat_window();//先关闭聊聊天窗口
                                                that.get_friend_list();// 重新加载好友列表
                                        }
                                        //收到加好友的消息
                                        else if(data.type===5){
                                                that.toastMsg("!你收到了一条好友请求，请查看系统消息!");
                                                that.get_notice();//刷新系统消息
                                                that.notice_check = true;
                                        }
                                        //收到好友删除的消息
                                        else if(data.type===6){
                                                that.toastMsg("!你收到了一条好友删除通知，请查看系统消息!");
                                                that.get_notice();//刷新系统消息
                                                that.close_chat_window();
                                                that.get_friend_list();
                                                that.notice_check = true;
                                        }
                                }
                        }
                },
                socket1_init(){
                        let that = this;
                        if(typeof (WebSocket) == "undefined"){
                                console.log("您的浏览器不支持websocket");
                        }else{
                                let socketUrl = "ws://"+url+"/socket1/"+this.user_id;
                                if(socket1!=null){
                                        socket1.close();
                                        socket1 = null;
                                }
                                socket1 = new WebSocket(socketUrl);
                                //打开事件
                                socket1.onopen = function () {
                                        console.log("websocket1已经打开");
                                }
                                //获取消息事件.
                                socket1.onmessage = function (msg) {
                                        let data = JSON.parse(msg.data);
                                        if(data.type===0)//用户登录提醒
                                        {
                                                // alert("您的账户已在别处登录!");
                                                // sessionStorage.removeItem("id");
                                                // window.location.href="/logout";
                                        }else if(data.type===1)
                                        {
                                                that.lobby_number = data.onlineNum;
                                        }else if(data.type===2){//收到消息推送
                                                //先判断是不是自己发的
                                                let n = data.name.substr(0,data.name.lastIndexOf("|"));
                                                if(n!==that.user_id.toString()){
                                                        let message = [];
                                                        message.type = 'in';
                                                        message.content = data.content;
                                                        if(data.name.substr(0,2)==="游客")
                                                        {
                                                                message.name = data.name.substr(2,data.name.lastIndexOf("(")-2)+"(游客)";
                                                        }else{
                                                                message.name = data.name.substr(data.name.lastIndexOf("|")+1,data.name.length-data.name.lastIndexOf("|")+1);
                                                        }
                                                        message.url = data.url;
                                                        message.time = data.time;
                                                        that.lobby_messages.push(message);
                                                        that.toastMsg("你收到一条来自群聊@公共聊天室@的消息");
                                                        that.scroll();//话到底
                                                }
                                        }
                                }
                        }
                }
        },
        created:function () {
                this.user_id = id;
                //this.my_groups[-1] = []
                this.my_groups[-1] = {url:"",messages:[]};//防止切换群聊时头像出错的问题
                // friend.url = ;//防止切换聊天好友时头像出错的问题
                this.friends[-1] = {url: "/images/normal.png"};
                //获取用户信息
                this.get_my_info();
                //获取好友列表
                this.get_friend_list();
                //获取系统消息
                this.get_notice();
                //获取聊天室记录
                this.get_lobby_messages();
                //初始化socket链接
                this.socket_init();
                //初始化socket2
                this.socket1_init();
                //获取聊天群组
                this.get_my_groups();
        }
})

