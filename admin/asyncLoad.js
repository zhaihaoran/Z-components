define([
    'jquery',
    'js/admin/components/utils',
    'history_adapter',
    'js/admin/components/loading',
], function($, utils) {

    "use strict";

    /**
     * Async - 列表查询和分页的 ajax + history 封装控件
     * @exports Async
     * @param {string} triggerElement - 触发节点
     * @param {string} renderElement - 渲染节点 
     * @param {Object} options - config 
     * @example
     * new Async('.query-form', '.admin-list', {
     *     type:"form",
     * })
     */
    var Async = function(triggerElement, renderElement, options) {

        var me = this;
        
        /** @private 渲染区域的节点信息  */
        me.renderDom = renderElement;
        /** @private 触发区域的节点信息  */
        me.triggerDom = triggerElement;
        /** @private 储存缓存页面url和内容的map信息，同时储存在sessionStorage里 */
        me.cache = {};
        /** @private 一定要记得将原页面内容存入到cache中，防止history后退原页面因为没有ajax内容而置空 */
        var str = $('<div>').append($(me.renderDom).clone()).html();

        sessionStorage.setItem(location.href, str);
        me.cache[location.href] = true;

        me.title = document.title;
        me.settings = $.extend({}, Async.Config, options);

        me.init();
    }

    /**
     * 配置项
     */
    Async.Config = {

        /**
         * type 类型
         * "form" - 表单提交时的action
         */
        type: "form",
    }
    
    $.extend(Async.prototype, 
        /**
         * @lends Async.prototype
         */
        {

        /**
         * 初始化
         */
        init: function() {

            var me = this;

            me.bindEvent();
            me.initHistory();
            me.initHash()
        },

        /**
         *  history初始化
         */
        initHistory: function() {

            var me = this;

            History.Adapter.bind(window, 'statechange', function() { // Note: We are using statechange instead of popstate
                /** @private 后退就是每次url发生改变，对应重新渲染一次ajax传过来的页面 */
                var State = History.getState();
                var page = State.data.page || 1;

                me.settings.type === "form" && me.setFormState(State.data);
                me.update(State.data, sessionStorage.getItem(State.url));
            });
        },

        // 绑定事件
        // 选取出会触发局部刷新的button 
        // 1.分页查询时会触发
        // 2.查询query触发
        // 列表切换 做成纯粹的single page 多页面js可能会冲突

        /**
         * 给triggerDom绑定渲染事件
         * 
         * @param {any} $parent 父级jQuery Element
         */
        bindEvent: function($parent) {

            var me = this;

            $parent = $parent ? $parent : $('body');

            me.event = me.settings.type === "form" ? "submit" : "click";

            $parent.find(me.triggerDom).on(me.event, me, me.onRender);

        },

        /**
         * 根据url解析成对象，过滤partial，执行替换history状态
         */
        initHash: function() {
            var me = this;
            
            var location = window.location;

            if (location.search.length > 0) {
                me.hashObj = tools.urlEncode(location.href)
            } else {
                me.hashObj = {};
            }
            var page = me.hashObj.page || 1;

            (me.settings.type === "form") && me.setFormState(me.hashObj);
            History.replaceState(me.hashObj,me.title, location.href);
            // 如果hash相同,则不pushState 和 ajax
        },

        /**
         * 渲染页面中的表格字段，进行填充
         * 
         * @param {object} hash 页面参数的json格式
         */
        setFormState: function(hash) {
            var me = this;
            // 先清空表单
            tools.clearForm(me.triggerDom);
            // 从url上的拿到的json渲染到form里
            for (var attr in hash) {
                $(me.triggerDom).find('[name="' + attr + '"]').val(hash[attr] || "").trigger('change')
            }
        },

        /**
         * @private query 触发ajax 时注意节流和记忆，防止多次发送ajax
         */ 

        /**
         * 渲染事件，包含了url过滤替换，ajax请求、储存session和update
         * @param {any} e 包含了上文的环境和数据
         */
        onRender: function(e) {

            var me = e.data;
            var that = this;
            e.preventDefault();

            /**
             * @private
             * 分多钟情况处理(目前想到的场景)
             *
             * 1.分页
             * 2.查询
             * 3.列表button,click触发
             *
             * 分别获取对应的url
             */
            var url, id = $(that).data('partial') || 1;

            switch (me.settings.type) {

                case "form":
                    var values = $(that).serialize()
                    var search = values ? '?' + values : "";
                    url = e.target.action + search;
                    break;

                case "link":
                    url = location.origin + $(that).attr('href');
                    break;
                default:
                    url = "#";
            }

            url = url.replace(/\partial=\w&/, "");

            /**
             * @private
             * 分页情况: 1.考虑末尾下一页和头部点击下一页情况的状态，不希望发送ajax查询
             */
            if (url && url.indexOf('#') < 0) {
                
                $(me.renderDom).loading({
                    theme: "random",
                    start: true
                });

                me.xhr && (me.xhr.readyState === 4) && me.xhr.abort();

                if (url in me.cache) {

                    me.hashObj = utils.pick(tools.urlEncode(url), "partial");
                    History.pushState(me.hashObj,me.title, url)
                    $(me.renderDom).loading('destroy');

                } else {

                    me.xhr = $.ajax({
                        url: url.indexOf('partial') < 0 ? url + '&partial=' + id : url,
                        context: me
                    }).done(function(html) {

                        // 登录超时
                        if(html.indexOf('<head>')>1) {
                            window.location.reload();
                            return;
                        }

                        me.hashObj = utils.pick(tools.urlEncode(url), "partial");
                        url = url.replace(/\partial=\w&/, "")
                        // 在这块将url中的partial相关的东西处理掉
                        me.cache[url] = true;
                        sessionStorage.setItem(url, html);
                        History.pushState(me.hashObj,me.title, url)

                        $(me.renderDom).loading('destroy');

                    }).fail(function() {
                        $(me.renderDom).loading('destroy');
                    });
                }
            }

        },

        /**
         * 重新更新渲染页面
         * 
         * @param { This } scope 指代上文环境 This
         * @param { DOM ELement } html ajax获取的htmlstring 
         */
        update: function(scope, html) {
            var me = this;

            // 要解绑事件,替换dom后再重新绑定
            $(me.renderDom).replaceWith(html);
            // 重新获取新的dom
            me.$new = $(me.renderDom);
            $(me).triggerHandler('pjax.update', me.$new);
            me.afterBind(me.$new);

            // 重新绑trigger事件
            me.bindEvent(me.$new);
        },

        /**
         * 给外界调用的一个方法，方便当ajax更新完页面后的一些控件和事件重新初始化和绑定
         * @param {any} html 页面结构
         */
        afterBind: function(html) {},
        // $.data 比$Obj.data() 快了10倍，强烈建议使用第一种
    });

    window.Async = Async;
    return Async;
});