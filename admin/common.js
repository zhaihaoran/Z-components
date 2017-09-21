define([
    "jquery",
    "js/admin/components/utils",
    "js/admin/api/config",
    "js/admin/components/modal",
    "js/admin/components/asyncLoad",
    'datetimepicker',
    'select2',
    'icheck',
    'validator',
    'material',
    "adminLte",
], function ($, tools, config, modal, Async) {

    "use strict";

    /**
     * iqidao Admin Common
     * @exports Common
     * @param {any} options - 暂无配置
     */
    var Common = function (options) {
        var me = this;

        me.init();
        // modal init
        me.adminModal(options);
    };

    Common.prototype = {

        sidebarConfig: {
            height: 50,
            rebound_speed: 300 /* speed */
        },

        /**
         * 各个封装件初始化，主流程函数
         */
        init: function () {
            var me = this;

            // 声明dom
            me.render();

            $.material.init();

            me.sidebarMenu();
            // me.resetOptions();
            me.recordScrollBarPosition();
            me.$tooltip.tooltip();

            me.Async = new Async('.query-form', '.admin-list', {
                type: "form",
            });

            me.Async2 = new Async('.pagination a', '.admin-list', {
                type: "link",
            });

            $(me.Async).on('pjax.update', me, me.pluginInit);
            $(me.Async2).on('pjax.update', me, me.pluginInit);

            // datetimepicker
            if (me.$datetimepicker.length > 0 && $.fn.datetimepicker !== 'undefined') {
                me.$datetimepicker.datetimepicker({
                    format: 'YYYY-MM-DD HH:mm',
                });
            }
            // select2
            if (me.$select2.length > 0 && $.fn.datetimepicker !== 'undefined') {
                me.$select2.select2();
            }
            // icheck
            if (me.$icheck.length > 0 && $.fn.datetimepicker !== 'undefined') {
                me.$icheck.iCheck({
                    checkboxClass: 'icheckbox_square-red',
                });
            }
            // clear
            me.clearform();

            // validator
            $('.validator-form').validator();

            me.$header = $('header.main-header');
            me.$header.on({
                click: function (e) {
                    // contains 第一个元素必须为dom，从第二个元素开始向第一个元素寻找
                    // 而且contains不能匹配到相等的元素
                    if ($.contains($('#search', this)[0], e.target) || $(e.target).attr('id') === "search") {
                        me.$header.addClass('search-toggle')
                    } else {
                        if (!$.contains($('.search-text')[0], e.target)) {
                            me.$header.removeClass('search-toggle');
                        }
                    }
                },
                keydown: function (e) {
                    // esc
                    if (e.keyCode === 27 && $(this).attr('class').indexOf('search-toggle') > -1) {
                        me.$header.removeClass('search-toggle');
                    }
                }
            });

            me.fileUpload();

            // load scrolllbar position
            var value = sessionStorage.getItem('pagePosition');
            $(window).scrollTop(value);

            me.navbarSearch();
            me.renderUserGroup();
        },

        /**
         * 表单清空按钮初始化绑定
         */
        clearform: function () {
            var me = this;
            // reset 只能还原为初始值，不好；
            $('#clear').on('click', function () {
                var $form = $(this).parents('form');
                $(':input', $form)
                    .not(':button, :submit, :reset, :hidden')
                    .val('')
                    .removeAttr('checked')
                    .removeAttr('selected');
                $('select', $form).val(null).trigger('change');
            });
        },

        /**
         * 阻止表单多次重复提交
         */
        stopSubmitRepeat: function () {
            var me = this;

            $('form').not('.query-form').on('submit', function () {
                $(":submit", this).prop('disabled', true);
            })
        },

        /**
         * 渲染用户类型
         */
        renderUserGroup: function () {
            var $userGroup = $('#userGroup');
            var group = $userGroup.find('.hidden').text();

            $userGroup.addClass(config.userGroups[group].class);
            $userGroup.text(config.userGroups[group].name);
        },

        /**
         * pjax后控件初始化
         * @param {any} e 
         */
        pluginInit: function (e) {

            var me = e.data;
            var $html = e.target.$new;

            $('.select2', $html).select2();
            $('.datetimepicker', $html).datetimepicker({
                format: 'YYYY-MM-DD HH:mm',
            });
            me.adminModal();
            $.material.init();
        },

        /**
         * 渲染
         */
        render: function () {
            var me = this;

            me.adminroot = window.ADMIN_ROOT;
            me.$body = $('body');
            me.$sidebar = $('aside.main-sidebar', me.$body);

            $('.sidebar', me.$sidebar).css('height', $(window).height() - 60);

            me.$treemenu = $('.treeview-menu', me.$sidebar);
            me.$searchButton = $('#search', me.$header);
            // pluginInit
            me.$tooltip = $('[data-toggle="tooltip"]', me.$body);
            me.$select2 = $('.select2');
            me.$datetimepicker = $('.datetimepicker', me.$body);
            me.$icheck = $('.icheck');
            
        },

        /**
         * 文件上传校验和文件名称渲染
         */
        fileUpload: function () {
            var me = this;

            var $fileinput = $('input[type="file"]');
            $fileinput.on('change', function () {
                // 如果没有选择文件
                if ($(this).val() === '') {
                    return false;
                }
                // 由于FileList只具有可读权限，所以想要做删除修改的权限的话，需要copy一份，然后把copy的传过去
                var file = this.files;
                var str = "";
                var length = file.length;
                for (var i = 0; i < length; i++) {
                    str += file[i].name + " ";
                }
                $(this).parent().siblings('.file-path').attr('title', str).children('p').html(str);
                str = "";
            });
        },

        /**
         * 左侧菜单栏平移浮动
         * @param {any} options 
         */
        sidebarMenu: function (options) {
            var me = this;

            var config = $.extend(me.sidebarConfig, options || {});

            // aside
            var $sidebarmenu = $('.sidebar-menu', me.$sidebar),
                $sidebarLi = $('.treeview', $sidebarmenu),
                $line = $('.sidebar-line', $sidebarmenu),
                thisY;
            // 正则表达式里，不匹配某一字符串可以用(?!a)表示

            var pathname = window.location.pathname;

            $sidebarLi.each(function (i, el) {
                var treeurl = $(el).find('.treeview-menu li a').attr('href');
                if (pathname.indexOf(treeurl) > -1) {
                    $(el).addClass('active').children('.treeview-menu').addClass('menu-open');
                    $line.css('top', $(el).position().top);
                }
            });

            // 设置辅助线高度和宽度
            $line.height(config.height);
            var $active = $('.treeview.active', $sidebarmenu);

            $sidebarLi.on('mouseenter', function () {
                thisY = $(this).position().top;
                $line.stop(true, true).animate({
                    top: thisY
                }, config.rebound_speed);
                return false;
            }).end().on('mouseleave', function () {
                if ($active.length > 0) {
                    thisY = $active.position().top;
                } else {
                    thisY = $(this).position().top;
                }
                $line.stop(true, true).animate({
                    top: thisY
                }, config.rebound_speed);
            });
        },

        /**
         * 顶部全局用户搜索初始化
         */
        navbarSearch: function () {
            var me = this;

            tools.select2Ajax('.navbar-search', Config.select2.selectUser, function (dom) {
                $(dom).on('select2:select', function (obj) {
                    var id = obj.params.data.Id;
                    window.location.href = me.adminroot + '/user?id=' + id;
                });
            });
        },

        /**
         * 记录滚动条位置
         */
        recordScrollBarPosition: function () {
            var me = this;
            // 记录滚动条位置 and 触发置顶
            $(window).on('scroll', tools.throttle(function () {
                sessionStorage.setItem('pagePosition', location);
            }, 500, 1500));
        },

        /**
         * 修改皮肤初始化
         * @deprecated 
         */
        resetOptions: function () {
            var me = this;

            if (me.$body.hasClass('fixed')) {
                $("[data-layout='fixed']").attr('checked', 'checked');
            }
            if (me.$body.hasClass('layout-boxed')) {
                $("[data-layout='layout-boxed']").attr('checked', 'checked');
            }
            if (me.$body.hasClass('sidebar-collapse')) {
                $("[data-layout='sidebar-collapse']").attr('checked', 'checked');
            }
        },

        /**
         * Modal 封装件初始化
         * 
         * @param {any} options 
         */
        adminModal: function (options) {
            var me = this;
            // 选取出所有页面上的初始dom
            var data = $(document).find('[modal="true"]');

            if (data && !!modal && (typeof options === 'object' || !options)) {
                modal.init(options, data);
            }
        },
    };

    var Common = new Common();

    window.tools = tools;
    // 装饰者
    tools.Common = Common;
    return tools;
});