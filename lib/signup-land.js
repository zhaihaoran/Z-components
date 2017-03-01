// Iqidao Landingpage Sign Moudule
//--- tutorial----
/*

在需求的dom结构上加data-name="sign" 
<a href="/" data-name="sign">

*/

$(function () {

    "use strict";

    // 根据url后缀改变dom结构
    /*
     * 学员成绩：achivement
     * 升段必读：ascending
     * 免费公开课：openclass
     * 测评系统：assessment
     * 免费体验课：experiencelesson
     *
     **/

    toastr.options = {
        "timeOut": "3000",
        "positionClass": "toast-bottom-center",
        "showMethod": "slideDown",
        "hideMethod": "slideUp"
    };

    var server_err = "系统繁忙，请稍后再试！";

    var Signup = function () {
        var me = this;

        me.init();
        me.initSignModule();

    };

    Signup.prototype = {

        renderHTML:[
            '<div class="modal fade wx_signup" id="SignUpModal" tabindex="-1" role="dialog" aria-hidden="true">',
              '<div class="modal-dialog">',
                '<div class="modal-content">',
                  '<div class="modal-header">',
                    '<!-- Nav tabs -->',
                    '<ul class="nav nav-tabs" role="tablist">',
                      '<li role="signup" data-num="1" class="active">',
                        '<a href="#signup" data-toggle="tab" >注册新用户</a>',
                      '</li>',
                      '<li role="signin"  data-num="2">',
                        '<a href="#signin" aria-controls="account" data-toggle="tab">已有账号登录</a>',
                      '</li>',
                    '</ul>',
                    '<!-- close button -->',
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
                  '</div>',

                  '<div class="tab-content clearfix" id="sign_in_up">',
                  '<!-- signin -->',
                    '<div class="tab-pane fade  clearfix" id="signin" >',
                      '<form class="wx_input form-signin" role="form" id="wx_signin" data-toggle="validator">',
                        '<div class="form-group" id="mobile-group">',
                          '<input type="text" name="key" class="form-control" placeholder="您的手机号" autofocus="" required="" pattern="^\\d{11}$" data-error="手机号应为11为数字">',
                          '<div class="help-block with-errors"></div>',
                        '</div>',
                        '<div class="form-group">',
                          '<input type="password" name="password" class="form-control" placeholder="密码" required="" data-minlength="6" data-maxlength="20" data-error="密码为6-20位数字或字母">',
                          '<div class="help-block with-errors"></div>',
                        '</div>',
                        '<div class="form-group input-group" id="captcha-group">',
                            '<input type="text" name="captcha" class="form-control" placeholder="验证码" aria-describedby="basic-addon2">',
                            '<div class="help-block with-errors"></div>',
                            '<span class="input-group-addon captcha">',
                                '<img src="/api/user/captcha?_=1474166567598" alt="" title="点击刷新验证码" >',
                            '</span>',
                        '</div>',
                      '</form>',
                    '</div>',
                    '<!-- signup -->',
                    '<div class="tab-pane fade in active clearfix"  id="signup">',
                      '<form  class="wx_input form-signin" role="form" id="wx_signup" data-toggle="validator">',
                       '<div class="form-group">',
                          '<input type="text" name="realName" class="form-control" placeholder="真实姓名" autofocus="" required data-minlength="2" data-maxlength="20" data-error="姓名长度为2-20个字符"/>',
                          '<div class="help-block with-errors"></div>',
                        '</div>',
                        '<div class="form-group" id="mobile_num">',
                          '<input type="text" name="mobile" class="form-control" placeholder="您的手机号" autofocus="" required="" pattern="^\\d{11}$" data-error="手机号应为11为数字">',
                          '<div class="help-block with-errors"></div>',
                        '</div>',
                        '<div class="form-group">',
                          '<input type="password" name="password" class="form-control" placeholder="密码" required="" data-minlength="6" data-maxlength="20" data-error="密码为6-20位数字或字母">',
                          '<div class="help-block with-errors"></div>',
                        '</div>',
                        '<div class="form-group clearfix" id="verify-group">',
                          '<div class="form-group input-group">',
                            '<input type="text" name="mobileCaptcha" class="form-control" placeholder="验证码" aria-describedby="basic-addon2">',
                            '<div class="help-block with-errors"></div>',
                            '<span class="input-group-addon captcha">',
                              '<img src="/api/user/captcha?_=1474166567598" alt="" title="点击刷新验证码" >',
                            '</span>',
                          '</div>',
                          '<div class="form-group input-group">',
                            '<span class="input-group-btn">',
                              '<button id="code-btn" class="btn btn-danger" type="button">获取短信验证码</button>',
                            '</span>',
                            '<input type="text" name="verifyCode" class="form-control" placeholder="验证码" aria-describedby="basic-addon2">',
                            '<div class="help-block with-errors"></div>',
                          '</div>',
                          '<div class="form-group input-group hidden" id="captcha-group">',
                            '<input type="text" name="captcha" class="form-control" placeholder="验证码" aria-describedby="basic-addon2" >',
                            '<span class="input-group-addon captcha">',
                              '<img src="" alt="" title="点击刷新验证码">',
                            '</span>',
                          '</div>',
                        '</div>',
                      '</form>',
                    '</div>',
                  '</div>',
                  '<div class="modal-footer">',
                    '<button class="btn btn-default" data-dismiss="modal" >关闭</button>',
                    '<button class="btn btn-primary" id="sign-submit" data-loading-text="请稍后...">注册</button>',
                    '<div class="alert alert-danger" style="display:none;margin-top: 10px;text-align: center;"></div>',
                  '</div>',
                '</div>',
              '</div>',
            '</div>'
        ].join(''),       

        submitUrl: '/api/user/signup',
        siginUrl: '/api/user/signin',
        verifyCodeStatusUrl: '/api/user/signup/verfiyCode/status',
        mobileVerifyUrl: '/api/user/signup/verfiyCode',
        captchaUrl: '/api/user/captcha',
        mobileExistUrl: '/api/user/mobile/existence',
        signupUrl: '/api/activity/user/signup/free',
        statusUrl: '/api/user',

        init:function() {
            var me = this;

            me.initDOM();
            me.render();
            me.queryParam();
        },

        queryParam:function(){

            var me = this;

            /* 获取url上的keyword参数  */
            var search = window.location.search;
            // 选中的a链接点击触发自动加跟踪参数
            $('a[data-name="sign"]').on('click',function(){
                var href = $(this).attr('href');
                // 排除掉弹乐语那部分a
                if (href) {
                    // 包含视频和文章列表
                    if(href.indexOf('?') > -1){
                        $(this).attr('href',href + "&" + search.substring(1));
                    } else {
                        // 按钮
                        $(this).attr('href',href + search);
                    }
                }
                return false;
            });

            // 根据param改变dom结构
            var paramArray = search.substring(1).match(/param\=\w+/g);
            var param = paramArray === null ? " " : paramArray.join('').substr(6);

            switch(param){
                case "achivement":
                    me.$wrapper_1.detach().prependTo(me.$page_content);
                    break;
                case "ascending":
                    me.$wrapper_2.detach().prependTo(me.$page_content);
                    break;
                case "openclass":
                    me.$wrapper_3.detach().prependTo(me.$page_content);
                    break;
                case "assessment":
                    me.$wrapper_4.detach().prependTo(me.$page_content);
                    break;
                case "experiencelesson":
                    me.$wrapper_5.detach().prependTo(me.$page_content);
                    break;
                default:
                    break;
            }
        },


        initDOM:function() {

            var me = this;

            me.$initDOM = $('[data-name=sign]');

            $(me.renderHTML).appendTo($('body'));

            me.$initDOM.on('click',function(e){
                e = e || window.event;
                e.preventDefault();

                me.href = $(e.target).closest('[data-name=sign]').attr('href') || $(e.target).attr('href');
                me.isShowModal();
            });

        },

        isShowModal:function(){
            var me = this;

            // leyu
            me.$leyudom = $('a#looyu_dom_1');
            // 判断用户状态，是否登陆;
            $.ajax({
                url: me.statusUrl,
                type: 'get',
                dataType: 'json'
            }).done(function (data){
                if(data.data !== null){
                    if(me.href){
                        window.location.href = me.href;
                    } else{
                        // alert leyu
                        me.$leyudom.trigger('click');
                    }
                } else{
                    $('#SignUpModal').modal('show');
                }
            });
        },

        render: function () {
            var me = this;
             //触发DOM
            me.$submit = $('#sign-submit');
            me.$signTab = $('#SignUpModal ul.nav-tabs[role=tablist] li');

            me.$signupform = $('form#wx_signup').validator().on('submit', {
                scope: me
            }, me.wx_signup);
            me.$signinform = $('form#wx_signin').validator().on('submit', {
                scope: me
            }, me.wx_signin);
            me.$error = $('.alert');
            me.$coopId = $('#coopId');
            //图片
            me.$captcha = $('#verify-group', me.$signupform);
            me.$codeBtn = $('#code-btn', me.$signupform);

            me.$page_content = $('.page-content');
            me.$wrapper_1 = $('#achivement');
            me.$wrapper_2 = $('#ascending');
            me.$wrapper_3 = $('#openclass');
            me.$wrapper_4 = $('#assessment');
            me.$wrapper_5 = $('#experiencelesson');
        },

        initSignModule: function () {
            var me = this;

            me.$submit.on('click.weixin', {
                scope: me
            }, me.wx_signup).text("注册");

            me.$signTab.on('click', function () {
                me.$submit.prop('disabled', false);
                me.num = $(this).data('num');
                me.$submit.off('click.weixin');
                if (me.num === 1) {
                    me.$submit.on('click.weixin', function (e) {
                        me.$signupform.submit();
                    }).text("注册");
                    } else {
                    me.$submit.on('click.weixin', function (e) {
                        me.$signinform.submit();
                    }).text("登录");
                }
                me.$error.css('display', 'none');
            });

            me.$captcha2 = $('#captcha-group');
            //captcha
            me.$captcha.find('img').on('click', function () {
                $(this).attr('src', me.captchaUrl + '?_=' + new Date().getTime());
            });
            me.$captcha2.find('img').on('click',function(){
                $(this).attr('src', me.captchaUrl + '?_=' + new Date().getTime());
            });
            //codeBtn
            me.$codeBtn.on('click', me, me.getMobileCode);
        },

        getMobileCode: function (e) {
            var me = e.data;

            e.preventDefault();

            me.mobileValidate({
                data: me
            }, function (val) {
                var captcha = me.$captcha.find('input').val();
                $.ajax({
                    url: me.mobileVerifyUrl,
                    type: 'post',
                    data: $.param({
                        mobile: val,
                        mobileCaptcha: captcha,
                        type: 'signup'
                    }),
                    dataType: 'json'
                }).done(function (data) {
                    if (data && data.status === 0) {
                        me.setCodeCounter(data.data);
                    } else if (data && data.status === 108) {
                        toastr.error('验证码错误！');
                        me.updateCaptcha(me.$captcha);
                    }
                });

            });
        },

        setCodeCounter: function (time) {
            var me = this;
            if (time > 0) {
                // prop?
                me.$codeBtn.prop('disabled', true).text('剩余' + time + '秒');
                //递归
                setTimeout(function () {
                    me.setCodeCounter(time - 1);
                }, 1000);
            } else {
                me.$codeBtn.prop('disabled', false).text('获取短信验证码');
            }
        },

        mobileValidate: function (e, callback) {
            var me = e.data;
            me.$mobile = $('#mobile_num input', me.$signupform);
            var val = me.$mobile.val();

            var bool = /^\d{11}$/.test(val);

            if (val && bool) {
                $.ajax({
                    url: me.mobileExistUrl,
                    data: $.param({
                        mobile: val
                    }),
                    dataType: 'json'
                }).done(function (data) {
                    if (data && false === data.data) {
                        if(callback) {
                            callback(val);
                        }
                        me.$mobile.next().html('');
                    } else {
                        me.$mobile.parent().addClass('has-error');
                        me.$mobile.next().text('该手机号已被占用');
                    }
                });
            }

            return bool ? val : null;
        },

        wx_signup: function (e) {
            var me = e.data.scope;

            if (e.isDefaultPrevented()) {
                // handle the invalid form...
                return;
            } else {
                e.preventDefault();
                var $form = me.$signupform;
                me.$submit.prop('disabled', true);

                var values = $form.serialize();
                $.ajax({
                    url: me.submitUrl,
                    data: values,
                    type: 'post',
                    dataType: 'json',
                }).done(function (data) {

                    if (data.status === 0) {
                        if(me.href){
                            window.location.href = me.href + '&register=true';
                        } else{
                            // alert leyu
                            me.$leyudom.trigger('click');
                        }
                    } else if (data && data.status === 108) {
                        me.$error.text('验证码错误！').show();
                        me.updateCaptcha(me.$captcha);
                    } else if (data && data.status === 105) {
                        me.$error.text('短信验证码错误！').show();
                    } else if (data && data.status === 101) {
                        me.$error.text("手机号码已占用").show();
                    } else if (data && data.status === 10) {
                        me.$error.text("注册错误，请重新输入").show();
                    } else if (data && data.status === 103) {
                        me.$error.text("验证码错误").show();
                        me.updateCaptcha(me.$captcha);
                    }
                }).fail(function (data) {
                    me.$error.text("注册失败，请稍后再试").show();
                }).always(function (argument) {
                    me.num = me.$signTab.filter('.active').data('num');
                    me.$submit.prop('disabled', false);

                    if (me.num === 1) {
                        me.$submit.text('注册');
                    } else {
                        me.$submit.text('登录');
                    }
                });
            }
        },

        wx_signin: function (e) {
            var me = e.data.scope;

            if (e.isDefaultPrevented()) {
                // handle the invalid form...
                return;
            } else {
                e.preventDefault();

                me.$submit.prop('disabled', true);

                var $form = me.$signinform;
                var key = $('[name=key]', $form).val();
                var password = $('[name=password]', $form).val();
                var captcha = $('[name=captcha]',$form).val();

                var values = $.param({
                    key: key,
                    password: password,
                    captcha:captcha
                });
                $.ajax({
                    url: me.siginUrl,
                    data: values,
                    type: 'post',
                    dataType: 'json',
                }).done(function (data) {
                    if (data && data.status === 0) {
                        if(me.href){
                            // 通过注册进入
                            window.location.href = me.href;
                        } else{
                            // alert leyu
                            me.$leyudom.trigger('click');
                        }
                    } else if (data && data.status === 104) {
                        me.$error.text("用户名或密码错误").show();
                        me.updateCaptcha(me.$captcha2);
                    } else if (data && data.status === 108) {
                        me.$error.text('验证码错误！').show();
                        me.updateCaptcha(me.$captcha2);
                    }

                }).fail(function (data) {
                    me.$error.text("登陆失败，请稍后再试").show();
                    me.updateCaptcha(me.$captcha2);
                }).always(function (argument) {
                    me.num = me.$signTab.filter('.active').data('num');
                    me.$submit.prop('disabled', false);
                    if (me.num === 1) {
                        me.$submit.text('注册');
                    } else {
                        me.$submit.text('登录');
                    }
                });
            }
        },

        updateCaptcha: function (dom) {
            dom.find('img').attr('src', this.captchaUrl + '?_=' + new Date().getTime());
        },

    };

    new Signup();


});