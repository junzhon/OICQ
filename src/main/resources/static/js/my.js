$(document).ready(function(){
    $('.nav-content-bttn').on('click',
        function() {
            $('.nav-content ul li a').removeClass('active');
            $(this).addClass('active');
            var data_tab = $(this).attr('data-tab');
            $('.sidebar').removeClass('active');
            $('#' + data_tab).addClass('active');
            return ! 1
        });
    //打开聊天窗口
    $('.chat-list-item .avatar,.chat-list-item .chat-bttn').on('click',
        function() {
            $('.chat-content').addClass('mobile-active');
            return ! 1
        });
//退出聊天窗口
    $('.back-chat-div').on('click',
        function() {
            $('.chat-content').removeClass('mobile-active');
            return ! 1
        });
//黑夜模式
$('.night-mode').on('click',
    function() {
        $('body').toggleClass('dark');
        return ! 1
    });
//显示个人信息
    $('.profile-detail-bttn').on('click',
        function() {
            $('.chat-content').removeClass('mobile-active');
            $('.profile-content').addClass('active');
            return ! 1
        });
//关闭个人信息
    $('.close-icon').on('click',
        function() {
            $('.profile-content').removeClass('active');
            $('.chat-content').addClass('mobile-active');
            return ! 1
        });
//添加朋友
    $('.btn-plus.dropdown-toggle').on('click',
        function() {
            $('body').addClass('blureffect');
            $('#addfriend,.modal-backdrop,.model-bg').fadeIn();
            return ! 1
        });
//关闭加好友modal
    $('#addfriend-close').on('click',
        function() {
            $('body').removeClass('blureffect');
            $('#addfriend').fadeOut(0);
            $('#addfriend,.modal-backdrop,.model-bg').fadeOut();
            return ! 1
        });
//滑动
    nicescroll();

    function nicescroll() {
        $(".chat-body,.chat-list-content,.scroll-profile,.modal-content").niceScroll({
            cursorcolor: "#eee",
            cursoropacitymin: 0,
            cursoropacitymax: 1,
            cursorwidth: "3px",
            cursorborder: "0px solid #fff",
            cursorborderradius: "5px",
            zindex: "auto",
            scrollspeed: 60,
            mousescrollstep: 40,
            touchbehavior: !1,
            hwacceleration: !0,
            boxzoom: !1,
            dblclickzoom: !0,
            gesturezoom: !0,
            grabcursorenabled: !0,
            autohidemode: !0,
            background: "",
            iframeautoresize: !0,
            cursorminheight: 32,
            preservenativescrolling: !0,
            railoffset: !1,
            bouncescroll: !1,
            spacebarenabled: !0,
            disableoutline: !0,
            horizrailenabled: !0,
            railalign: "right",
            railvalign: "bottom",
            enabletranslate3d: !0,
            enablemousewheel: !0,
            enablekeyboard: !0,
            smoothscroll: !0,
            sensitiverail: !0,
            enablemouselockapi: !0,
            cursorfixedheight: !1,
            hidecursordelay: 400,
            irectionlockdeadzone: 6,
            nativeparentscrolling: !0,
            enablescrollonselection: !0,
            cursordragspeed: 0.3,
            rtlmode: "auto",
            cursordragontouch: !1,
            oneaxismousemode: "auto",
            scriptpath: "",
            preventmultitouchscrolling: !0,
            disablemutationobserver: !1,
        })
    }


});

