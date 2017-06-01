/**
*   author : wangyajun
*   date : 2017-04-17
*   note: jQuery-1.9.1+ 兼容IE8
**/
/**
*插件用法：
*显示模态框: $("#popBox").pop();
*关闭模态框: $("#popBox").pop("hide");
*参数：依照defaults参数配置
**/
;(function($,window,document,undefined){
    //Pop
    var Pop = function(el, opt) {
        _this = this;
        _this.opt = opt;
        this.$el = el;
        this.defaults = {   //默认配置
            big: true,                              //模态框的大小
            title: "标题",                          //标题
            body: "提示的内容",                //普通的提示内容
            loadHtml: {                       //加载页面、指定页面的div:("./pages/list.html #id")
                read: false,                        //是否启动读取页面方法
                path: "",                           //页面路径
                param: {},                          //参数;多个参数可以改本行为值{}，与loadHtml中load方法的参数对应
                callback: function(v){return v;}    //页面读取成功后回调函数,参数"v"为读取的内容
            },
            loadController: {
                deep: false,                        //是否启动
                path: "",                           //路径
                type: "get",                        //get 或者 POST
                dataType: "",                       //xml, json, script, 或者 html
                data: {},                           //参数
                callback: function(res){}              //回调函数
            },
            footer: {
                btn: [],                            //按钮的文字 多个按钮：["按钮1","按钮2"]
                callback: [],                       //按钮的触发函数 [fn,fn]
                align: "right"                     //按钮位置 left center right
            }
        };
        //样式表
        this.CSS = {
            popBox: {
                "width": "100%",
                "height": "100%",
                "background": "rgba(0,0,0,.5)",
                "position": "fixed",
                "top": 0,
                "left": 0,
                "index": 9999
            },
            dialog: {
                "width":"600px",
                "margin":"30px auto",
                background: "#fff",
                "border-radius": "4px",
                "box-shadow": "rgba(0, 0, 0, 0.498039) 0px 3px 9px"
            },
            header: {
                "min-height": "16.43px",
                padding: "15px",
                "border-bottom": "1px solid rgb(229, 229, 229)"
            },
            btnClose: {
                float: "right",
                "font-size": "21px",
                "font-weight": 700,
                "line-height": 1,
                color: "rgb(0, 0, 0)",
                "text-shadow": "rgb(255, 255, 255) 0px 1px 0px",
                opacity: 0.2,
                background: "#fff",
                border: 0,
                cursor:"pointer"
            },
            popBody: {
                padding:"15px",
                "overflow": "auto",
                "font-size": "14px"
            },
            btn: {
                display: "inline-block",
                "margin-bottom": "0px",
                "line-height": 1.42857,
                "text-align": "center",
                "white-space": "nowrap",
                "vertical-align": "middle",
                "touch-action": "manipulation",
                cursor: "pointer",
                padding: "6px 12px",
                border: "1px solid #ddd",
                background: "#fff",
                "border-radius": "4px",
                "margin-right": "4px"
            }
        };
        this.options = $.extend(true, {}, this.defaults, opt);
        //尾部动态样式
        this.CSS.popFooter = function(){
            var oFoot = {
                "border-top": "1px solid #ddd",
                padding: "15px",
                "text-align": _this.options.footer.align
            };
            return oFoot;
        }
        //创建模态框
        this.create = function(el){
            var strBox ='<div id="popBox">'+
                		  '<div class="modal-dialog">'+
                    		'<div class="pop modal-content">'+
                    			'<div class="pop-header modal-header">'+
                                    '<span class="pop-title modal-title h4">标题</span>'+
                                    '<button type="button" class="close btnClose">'+
                                        '<span aria-hidden="true">×</span>'+
                                    '</button>'+
                                '</div>'+
                    			'<div class="pop-body modal-body"></div>'+
                    			'<div class="pop-footer modal-footer">';
            var oBtns = _this.options.footer.btn;
            var oFuns = _this.options.footer.callback;
            for (var i = 0; i < oBtns.length; i++) {
                var strBtn = '<button type="button" class="btn obtn obtn'+i+'">'+ oBtns[i] +'</button>';
                strBox += strBtn;
            }
            strBox +=               '<button type="button" class="btn btnClose">关闭</button>'+
                                  '</div>'+
                              	'</div>'+
                            '</div>'+
                         '</div>';
            $("body").append(strBox);
            $("#popBox .modal-footer .obtn").click(function(event) {
                var i = $(this).index();
                if($.isFunction(oFuns[i])){
                    oFuns[i]();
                }else {
                    console.log("错误：厉害了,我的哥！你的回调函数与按钮对应不上了,请检查回调函数的个数...");
                }
            });
        }
        //设置模态框样式
        this.setStyle = function(el) {
            $("#popBox").css(this.CSS.popBox);
            $("#popBox .pop-header").css(this.CSS.header);
            $("#popBox .pop-header .btnClose").css(this.CSS.btnClose);
            $(".pop-body").css(this.CSS.popBody);
            $("#popBox .modal-dialog").css(this.CSS.dialog);
            $("#popBox .modal-footer").css(this.CSS.popFooter());
            $("#popBox .modal-footer .btn").css(this.CSS.btn);
            if(!_this.options.big){
                $("#popBox .pop,#popBox .modal-dialog").width(300);
            }
        }
        //关闭模态框
        this.close = function(){
            //普通的按钮关闭
            $("#popBox .btnClose").click(function(event){
                $("#popBox").remove();
            });
            //点击模态框以外节点的关闭
            $("#popBox").click(function(event){
                //阻止事件冒泡
                if(event.target == this){
                    $("#popBox .btnClose").trigger("click");
                }
            });
            //外部调用关闭
            if(_this.opt == "hide"){
                $("#popBox .btnClose").trigger("click");
            }
        }
        //设置文本内容
        this.setText = function(){
            //标题
            $("#popBox .pop-title").text(this.options.title);
            //内容
            $("#popBox .pop-body").text(this.options.body);
        }
        //模态框读取页面
        this.loadHtml = function(){
            //是否读取页面
            if(this.options.loadHtml.read){
                //可读取某页面的指定片段
                $(".pop-body").load(this.options.loadHtml.path,this.options.loadHtml.param,this.options.loadHtml.callback);
            }
        }
        //读取controller返回的页面
        this.loadController = function(){
            //是否读取页面
            if(_this.options.loadController.deep){
                //可读取java类controller
                $.ajax({
                    url: _this.options.loadController.path,
                    type: _this.options.loadController.type,
                    dataType: _this.options.loadController.dataType,
                    data: _this.options.loadController.data
                })
                .done(function(res) {
                    if ($.isFunction(_this.options.loadController.callback)) {
                        $(".pop-body").html(res);
                        _this.options.loadController.callback(res);
                    } else {
                        console.log("错误："+_this.options.loadController.callback + ",不是函数,请检查...");
                    };
                })
                .fail(function(res) {
                    console.log(res);
                });
            }
        }
    }

    //调用Pop的方法
     Pop.prototype.init = function(){
         this.create();
         this.setStyle();
         this.close();
         this.setText();
         this.loadHtml();
         this.loadController();
     }

    //使用Pop
    $.prototype.pop = function(options) {
        //调用方法
        var plugin = new Pop(this, options);
        return plugin.init();
    }

})(jQuery,window,document);
