/* -- UMD 范式 -- */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(["jquery", "select2"], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('jquery'), require('select2'));
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory(root.jQuery);
    }
}(this, function ($) {
    // 工具类
    var tools = (function (window, jQuery) {

        "use strict";

        return {


            isElement: function (obj) {
                return !!(obj && obj.nodeType === 1);
            },

            // isArray
            isArray: function (a) {
                Array.isArray ? Array.isArray(a) : Object.prototype.toString.call(a) === '[object Array]';
            },


            // 判断字符串是否为空 
            isStrEmpty: function (str) {
                var me = this;

                if (str !== null && str.length > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            // 判断是否是中文
            isChine: function (str) {
                var me = this;

                var reg = /^([u4E00-u9FA5]|[uFE30-uFFA0])*$/;

                if (reg.test(str)) {
                    return false;
                }
                return true;
            },
            // 进入全屏
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

            // cookie操作
            cookieUtil: {
                path: "/",
                domain: 'www.iqidao.com',
                add: function (name, val) {
                    $.cookie(name, val, {
                        expires: 7,
                        path: this.path,
                        domain: this.domain,
                        secure: true
                    });
                },
                remove: function (name, val) {
                    $.cookie(name, null, {
                        path: this.path,
                        domain: this.domain
                    });
                },
                get: function (name) {
                    $.cookie(name, {
                        path: this.path,
                        domain: this.domain
                    });
                }
            },
            // 清空
            emptyTextarea: function (strIds) {
                try {            
                    var ids = strIds.trim(",").split(",");            
                    $(ids).each(function () {                
                        var obj = $(this.toString());                
                        if (obj.length > 0) {                    
                            $(obj).each(function () {                        
                                $(this).empty();                        
                                $(this).val("");                    
                            });                
                        } else {                    
                            obj.empty();                    
                            obj.val("");                
                        }            
                    });        
                } catch (ex) {            
                    if (PublicUtil.isDebug()) {                
                        throw new Error("js方法：【PublicUtil.emptyTextarea(strIds)】，error！");            
                    }        
                }
            },

            upload: function (option) {
                var me = this;

                function readFile() {
                    var file = this.files[0];

                    if (!/image\/\w+/.test(file.type)) {
                        alert("请确保文件为图像类型");
                        return false;
                    }

                    var reader = new FileReader();
                    reader.readAsDataURL(file);

                    reader.onload = function (e) {
                        option.result.innerHTML = '<img src="' + this.result + '" alt=""/ class="img-responsive" id="image_show">';
                    };
                }

                if (typeof FileReader === 'undefined') {
                    option.result.innerHTML = "<p class='warn'>抱歉，你的浏览器不支持 FileReader,无法显示</p>";
                    option.input.setAttribute('disabled', 'disabled');
                } else {
                    $(option.input).on('change', readFile);
                }
            },

            switchButton: function (namevalue, state) {
                var $dom = $('[name="' + namevalue + '"');

                $dom.bootstrapSwitch('destroy');
                if (state) {
                    $dom.bootstrapSwitch({
                        state: state
                    });
                }

                $dom.bootstrapSwitch();
            },

            formatDate: function (data) {
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
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
            },

            formatDateDay: function (data) {
                var date = new Date(data * 1000);
                var y = date.getFullYear(),
                    m = date.getMonth() + 1,
                    d = date.getDate();
                return y + "年" + m + '月' + d + '日';
            },

            select2Ajax: function (dom, url, callback) {
                var $dom = $(dom);

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
                    minimumInputLength: 1,
                    width: "100%",
                    maximumInputLength: 20,
                    ajax: {
                        url: "/admin001/" + url,
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                key: params.term,
                            };
                        },
                        processResults: function (data) {
                            var item;
                            for (var i = 0; i < data.Data.length; i += 1) {
                                item = data.Data[i];
                                item.id = item.Id;
                                item.text = item.Value;
                            }
                            return {
                                results: data.Data
                            };
                        },
                    },
                    escapeMarkup: function (m) {
                        return m;
                    },
                    templateResult: formatRepo,
                    templateSelection: formatRepoSelection,
                });

                callback && callback($dom);
            }
        };

    }).call(window, $);

    //    暴露公共方法
    window.tools = tools;
    return tools;

}));