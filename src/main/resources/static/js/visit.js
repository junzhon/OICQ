let myDate = new Date();
let socket1;
let url = "localhost:8084";//socket接口配置
let app = new Vue({
    el:"#app",
    data:{
        name:"",
        url:"",
        lobby_messages:[],
        lobby_number:0,
        lobby_text_typing:"",
        name_id:"",
    },
    methods:{
        //获取大厅聊天记录
        get_lobby_messages(){
            let that = this;
            axios.post('/get_lobby_messages',{}).then(function (response) {
                if(response.data.status===200){
                    let messages = response.data.messages;
                    for(let i=0;i<messages.length;i++){
                        let message = [];
                        message.type = messages[i].name==that.name_id?'out':'in';
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
                    that.scroll();
                }else
                {
                    console.log('获取大厅消息列表出错！');
                }
            }).catch(function () {
                console.log("服务器未响应！code 15");
            })
        },
        //滚动到聊天位置末尾
        scroll() {
            this.$nextTick(()=>{
                let container1 = this.$el.querySelector('#lobby-chat-body');
                container1.scrollTop = container1.scrollHeight;
            })
        },
        send_lobby_message(){
            //先检查用户是否有昵称，不然容易null
            if(this.name===""||this.name_id===""){
                alert("请先选择头像和设置昵称！");
                window.location.href="/login";
            }
            if(this.lobby_text_typing===""){
                alert('不能发送空消息！');
                return;
            }
            //通过web socket对方发送时时消息
            let timeNow = (myDate.getMonth()+1)+"月"+myDate.getDate()+"日 "+myDate.getHours()+":"+myDate.getMinutes();
            let message = {name:this.name_id,url:this.url,time:timeNow,content:this.lobby_text_typing,type:2}
            socket1.send(JSON.stringify(message));
            //显示到本地
            let msg = [];
            msg.type = 'out';
            msg.content = this.lobby_text_typing;
            msg.name = this.name;
            msg.url = this.url;
            msg.time = timeNow;
            this.lobby_messages.push(msg);
            this.scroll();
            //将消息保存到数据库
            let that = this;
            axios.post('/send_lobby_message',{
                name:that.name_id,
                url:that.url,
                content:that.lobby_text_typing,
                time:timeNow
            }).then(function (response) {
                if(response.data.status===200)
                {
                    that.lobby_text_typing = "";
                }else
                    console.log(response.data.msg);
            }).catch(function () {
                console.log("服务器未响应！code 12");
            })
        },
        show_info(){
          alert("其他功能只能在注册后使用哦~");
        },
        logout(){
          let r=confirm("是否退出聊天室？");
          if(r){
              sessionStorage.removeItem("name");
              sessionStorage.removeItem("url");
              window.location.href="/login";
          }
        },
        //生成唯一标识码
        get_uid(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        socket1_init(){
            let that = this;
            if(typeof (WebSocket) == "undefined"){
                console.log("您的浏览器不支持websocket");
            }else{
                let socketUrl = "ws://"+url+"/socket1/"+this.name_id;
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
                        console.log("用户名重复！");
                    }else if(data.type===1)
                    {
                        that.lobby_number = data.onlineNum;
                    }else if(data.type===2){//收到消息推送
                        //先判断是不是自己发的
                        if(data.name!=that.name_id){
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
                            that.scroll();//话到底
                        }
                    }
                }
            }
        }
    },
    created:function () {
        let n = sessionStorage.getItem("name");
        let u = sessionStorage.getItem("url");
        if(n===undefined||n===""||n===null||u===null||u===undefined||u===""){
            alert("请先选择头像和设置昵称！");
            window.location.href="/login";
        }
        this.name = n+"(游客)";
        this.url = u;
        if(sessionStorage.getItem("uid")!==null){
            this.name_id = sessionStorage.getItem("uid");
        }else{
            this.name_id = "游客"+n+"("+this.get_uid()+")";
            sessionStorage.setItem("uid",this.name_id);
        }
        this.get_lobby_messages();
        this.socket1_init();
    }
})