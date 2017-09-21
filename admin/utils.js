(function (root, factory) {

    "use strict";

    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'toastr', 'select2'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($, toastr, global) {

    "use strict";
    /**
     * @private 浏览器中的window或nodejs下的global
     */
    var root = typeof exports === 'object' ? global : window;

    /**
     * Utility functions to ease working for Admin work.
     * @exports Tool
     */
    var tools = {

        /**
         * 判断是否是dom元素
         * @param {any} obj 对象或者dom节点
         * @returns {boolean}
         */
        isElement: function (obj) {
            return !!(obj && obj.nodeType === 1);
        },

        /**
         * 清空表单
         * 
         * @param {any} element 父级dom节点
         */
        clearForm: function (element) {
            $(':input', $(element))
                .not(':button, :submit, :reset, :hidden')
                .val('').trigger('change')
                .removeAttr('checked')
                .removeAttr('selected');
        },

        /**
         * 节流函数 为了优化性能，确保times时间当函数多次触发时，函数只会并且必须执行一次
         * 
         * @param {any} fun 要执行的函数
         * @param {any} delay 延迟
         * @param {any} time 在time时间内必须执行一次
         * @returns {function} 返回新函数
         */
        throttle: function (fun, delay, time) {
            var timeout, startTime = new Date();
            // 最终产生一个新函数，加了延迟和time
            return function () {
                var context = this,
                    args = arguments,
                    curTime = new Date();
                clearTimeout(timeout);
                // 如果达到了规定的触发时间间隔，触发 handler
                if (curTime - startTime >= time) {
                    fun.apply(context, args);
                    startTime = curTime;
                    // 没达到触发间隔，重新设定定时器
                } else {
                    timeout = setTimeout(fun, delay);
                }
            };
        },

        /**
         * 小区域ajax修改接口
         * 
         * @param {any} element trigger dom
         * @param {any} api 接口地址
         */
        contenteditableajax: function (element, api) {
            var me = this;

            $(element).on('ajaxedit', function (e) {
                var name = $(this).data('name');
                // $(this).html()会转义，text不会转义
                var value = $(this).text();

                var data = {};
                data.id = $(this).data('id');
                data[name] = value;

                $.ajax({
                    url: root.ADMIN_ROOT + api,
                    type: 'POST',
                    data: data
                }).done(function (data) {
                    // 提示修改成功
                    if (data.Status !== 0) {
                        toastr.error("修改失败");
                    } else {
                        toastr.success("修改成功");
                    }
                })
            });

            $(element).on({
                blur: function () {
                    $(this).triggerHandler('ajaxedit');
                },
                keydown: function (e) {
                    if (e.keyCode === 13) {
                        e.preventDefault();
                        $(this).trigger('blur');
                    }
                }
            });
        },

        /**
         * 判断字符串是否为空
         * 
         * @param {any} str 字符串
         * @returns {boolean} 布尔值
         */
        isStrEmpty: function (str) {
            var me = this;

            if (str !== null && str.length > 0) {
                return true;
            } else {
                return false;
            }
        },

        /**
         * 判断是否是中文
         * 
         * @param {any} str 字符串
         * @returns {boolean} 布尔值
         */
        isChine: function (str) {
            var me = this;

            var reg = /^([u4E00-u9FA5]|[uFE30-uFFA0])*$/;

            if (reg.test(str)) {
                return false;
            }
            return true;
        },

        /**
         * 格式化日期，将时间戳转化为年
         * 
         * @param {any} timestamp 
         * @returns {int} 
         */
        formatYear: function (timestamp) {
            return parseInt(timestamp) / 3600 / 24 / 365;
        },

        /**
         * 进入全屏
         * 
         * @param {any} element 
         * @returns {boolean}
         */
        fullScreen: function (element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
            return true;
        },


        /**
         * 图片上传空间
         * 
         * @param {Object<Object>} option
         * option = {
         *     input: triggerButton to upload image {str},
         *     result: the area to show the image {str}
         * } 
         * @returns {any}
         */
        imageUpload: function (option) {
            var me = this;

            var $input = $(option.input),
                $result = $(option.result);

            if (!$input.length || !$result.length) {
                return;
            }

            if (typeof FileReader === 'undefined') {
                $result.html("<p class='warn'>抱歉，你的浏览器不支持 FileReader,无法显示</p>");
                $input.prop('disabled', true);
            } else {
                $input.on('change', function (e) {
                    var file = this.files[0],
                        reader = new FileReader();

                    if (!/image\/\w+/.test(file.type)) {
                        toastr.error("上传失败，确保上传的为图片文件");
                        return;
                    }

                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $result.html('<img src="' + this.result + '" alt=""/ class="img-responsive" id="image_show">');
                    };
                });
            }
        },

        /**
         * 网络地址转码为对象
         * 
         * @param {any} url 
         * @returns {object}
         */
        urlEncode: function (url) {
            // 处理"http://localhost:8989/admin001/order/switch"这种没有？的异常情况
            if (/\?/g.test(url)) {
                return JSON.parse('{"' + decodeURI(url.replace(/\S+\?/, "")).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
            } else {
                return {};
            }
        },

        formatDate: function (data, state) {
            var date = new Date(data * 1000);
            var y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                h = date.getHours(),
                minute = date.getMinutes();

            m = m < 10 ? '0' + m : m;
            d = d < 10 ? ('0' + d) : d;
            h = h < 10 ? ('0' + h) : h;
            minute = minute < 10 ? ('0' + minute) : minute;

            return !!state === true ? (m + '-' + d) : (y + '-' + m + '-' + d + ' ' + h + ':' + minute);
        },

        /**
         * 日期格式化 data为时间戳
         * 
         * @param {any} data 
         * @returns {str} 2017-9-8
         */
        formatDay: function (data) {
            var date = new Date(data * 1000);
            var y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                h = date.getHours(),
                minute = date.getMinutes();

            m = m < 10 ? '0' + m : m;
            d = d < 10 ? ('0' + d) : d;
            h = h < 10 ? ('0' + h) : h;
            minute = minute < 10 ? ('0' + minute) : minute;

            return y + '-' + m + '-' + d;
        },

        /**
         * 时间戳（s）中文化
         * 
         * @param {any} data timestamp
         * @returns {string} 2015年15月15日
         */
        formatDateDay: function (data) {
            var date = new Date(data * 1000);
            var y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate();
            return y + "年" + m + '月' + d + '日';
        },

        /**
         * 异步下拉框控件（滚动展示）
         * 
         * @param {any} $dom 渲染dom节点
         * @param {any} url 接口
         * @param {any} callback 回调函数
         * @returns {any}
         */
        select2Ajax: function ($dom, url, callback) {

            $dom = typeof $dom === "string" ? $($dom) : $dom;

            if ($dom.length < 1) {
                return;
            } else {

                function formatRepo(repo) {
                    if (repo.loading) {
                        return repo.text;
                    }

                    var markup = '<div class="clearfix text-center ajaxSelect">' + repo.text + '</div>';

                    return markup;
                }

                function formatRepoSelection(repo) {
                    return repo.text;
                }

                $dom.select2({
                    language: {
                        inputTooShort: function () {
                            return "请输入一个或多个字符进行查询";
                        }
                    },
                    minimumInputLength: 1,
                    width: "100%",
                    ajax: {
                        url: root.ADMIN_ROOT + url,
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                key: params.term,
                                si: params.page * 20 || 0,
                            };
                        },
                        processResults: function (data, params) {

                            var item;
                            params.page = params.page || 0;

                            for (var i = 0; i < data.Data.length; i += 1) {
                                item = data.Data[i];
                                item.id = item.Id;
                                item.text = item.Value;
                            }
                            return {
                                results: data.Data,
                                pagination: {
                                    more: !!data.Data.length
                                }
                            };
                        },
                        cache: true
                    },
                    escapeMarkup: function (m) {
                        return m;
                    },
                    templateResult: formatRepo,
                    templateSelection: formatRepoSelection,
                });
                callback && callback($dom);
            }
        },

        /**
         * select2List 异步下拉框控件（全展示）
         * 
         * @param {any} $dom 渲染dom节点
         * @param {any} api 接口
         * @param {any} callback 回调函数
         * @returns {any}
         */
        select2List: function ($dom, api, callback) {

            $dom = typeof $dom === "string" ? $($dom) : $dom;
            $dom.data('selects', 1);

            if ($dom.length < 1) {
                return;
            }

            $dom.select2({
                data: (function () {
                    var i, l, items = [];
                    $.ajax({
                        url: root.ADMIN_ROOT + api,
                        dataType: 'json',
                        async: false
                    }).done(function (data) {
                        l = data.Data.length
                        for (i = 0; i < l; i++) {
                            var item = {};
                            item.id = data.Data[i].Id;
                            item.text = data.Data[i].Value;
                            items.push(item);
                        }
                    })
                    return items;
                })(),
            });
            callback && callback($dom);
        },

        /**
         * 判断是否回文
         * 
         * @param {any} str 
         * @returns {boolean}
         */
        isPalindrome: function (str) {
            var ary = [];
            var Destr;
            for (var i = 0; i < str.length; i++) {
                // charAt 根据字符串的位置输出对应的字符
                ary.push(str.charAt(str.length - i - 1));
            }
            Destr = ary.join('');
            if (Destr === str) {
                return true;
            }
            return false;
        },

        /**
         * 计算阶乘
         * 
         * @param {any} n 
         * @returns {int|function}
         */
        factorial: function (n) {
            var me = this;

            if (n === 0) {
                return 1;
            } else {
                return n * me.factorial(n - 1);
            }
        },

        /**
         * underscroe.js里的pick方法，去除数据对象里的某个属性
         * 
         * @returns {onject} - 返回object去除key值之后的object
         * @example _.pick(object,keys)
         */
        pick: function () {
            var obj = Array.prototype.splice.call(arguments, 0, 1)[0];
            var i, l = arguments.length;

            if (obj === null) {
                return obj;
            }

            for (i = 0; i < l; i++) {
                if (arguments[i] in obj) {
                    delete obj[arguments[i]]
                }
            }
            return obj;
        },

        /**
         * html 转义
         * 
         * @param {any} str 
         * @returns {string} 转码过后的字符
         */
        escapeHtml: function (str) {
            return str.replace(/[<>"&]/g, function (match) {
                switch (match) {
                    case "<":
                        return "&t;";
                    case ">":
                        return "&t;";
                    case "&":
                        return "&mp;";
                    case "\"":
                        return "&quot;";
                }
            });
        },

        /**
         * 首字母大写
         * 
         * @param {any} str 
         * @returns {string} 
         */
        firstUpperCase: function (str) {
            return str.trim().replace(/^[a-z]/g, function (m) {
                return m.toUpperCase();
            });
        },

        /**
         * 深复制
         * 
         * @param {any} input 
         * @returns {any} 
         */
        clone: function (input) {
            var me = this;
            // 基本类型
            if (typeof input !== "object") {
                return input;
            }
            // 非基本类型
            var o = input.constructor === Array ? [] : {};
            for (var i in input) {
                // 深层次复制，需要递归调用
                o[i] = typeof input[i] === "object" ? me.clone(input[i]) : input[i];
            }
            return o;
        },

        /**
         * 数组去重
         * 
         * @param {any} array 
         * @returns {any}
         */
        aryPurge: function (array) {
            return array.filter(function (el, index, self) {
                // indexOf 只会默认保留第一个值
                return self.indexOf(el) == index;
            });
        },

        /**
         * @property {Object} versions 浏览器版本  
         */
        browser: {

            /**
             * @function version 浏览器版本校验
             * @private 为了防止在nodejs上用mocha测试时报错
             * @return {object} 判断浏览器种类和版本
             */
            versions: function () {

                if (root.navigator) {
                    var u = root.navigator.userAgent,
                        app = root.navigator.appVersion;
                    return {
                        trident: u.indexOf('Trident') > -1, //IE内核
                        presto: u.indexOf('Presto') > -1, //opera内核
                        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                        iPad: u.indexOf('iPad') > -1, //是否iPad
                        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                        weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                        qq: u.match(/\sQQ/i) == " qq" //是否QQ
                    }
                }
            }()
        }
    };

    root.tools = tools;
    return tools;
}));