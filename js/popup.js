/**
*   author : wangyajun
*   date : 2017-04-17
*   note: jQuery-1.9.1+ 兼容IE8
**/
/**
*插件用法：
*显示模态框: $(".popBox").pop();
*关闭模态框: $(".popBox").pop("hide");
*参数：依照defaults参数配置
**/
;(function($,window,document,undefined){
    //Pop
    var Pop = function(el, opt) {
        _this = this;
        _this.opt = opt;
        this.$el = el;
        this.defaults = {   //默认配置
            type: "pop",                      //pop为模态框,tips为提示框
            size: [600,"auto"],                       //模态框的大小参数:宽、高
            drag: true,                     //是否拖拽
            trigger: true,                   //是否点击黑色遮罩关闭
            title: "请输入标题！",                    //标题
            msg: "请设置提示内容！",                 //普通的提示内容
            tips: {                          //自动消失提示框，仅在type:"tips"下使用
                tips: "请设置提示信息！",            //提示的内容
                time: 2000                          //消失的时间：毫秒数
            },
            loadHtml: {                       //加载页面、指定页面的div:("./pages/list.html #id")
                read: false,                        //是否启动读取页面方法
                path: "",                           //页面路径
                param: {},                          //参数;多个参数可以改本行为值{}，与loadHtml中load方法的参数对应
                callback: function(v){return v;}    //页面读取成功后回调函数,参数"v"为读取的内容
            },
            loadController: {                 //可加载controller返回的页面
                deep: false,                        //是否启动
                path: "",                           //路径
                type: "get",                        //get 或者 POST
                dataType: "",                       //xml, json, script, 或者 html
                data: {},                           //参数
                callback: function(res){}           //回调函数
            },
            footer: {                       //模态框尾部，仅在type:"pop"下使用
                btn: ["关闭"],                            //按钮的文字 多个按钮：["按钮1","按钮2"]
                callback: [function(){$(".popBox").pop("hide")}],                       //按钮的触发函数 [fn,fn]
                align: "right"                     //按钮位置 left center right
            }
        };
        //样式表
        this.CSS = {
            popBox: {
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,.5)",
                position: "fixed",
                top: 0,
                left: 0,
                index: 9999
            },
            dialog: {
                background: "#fff",
                borderRadius: "4px",
                position: "absolute",
                top: "50%",
                left: "50%",
                boxShadow: "rgba(0, 0, 0, 0.498039) 0px 3px 9px"
            },
            header: {
                minHeight: "16.43px",
                padding: "15px",
                borderBottom: "1px solid rgb(229, 229, 229)"
            },
            btnClose: {
                float: "right",
                fontSize: "21px",
                fontWeight: 700,
                lineHeight: 1,
                color: "rgb(0, 0, 0)",
                textShadow: "rgb(255, 255, 255) 0px 1px 0px",
                opacity: 0.2,
                background: "#fff",
                border: 0,
                cursor:"pointer"
            },
            popBody: {
                padding:"15px",
                overflow: "auto",
                fontSize: "14px"
            },
            btn: {
                display: "inline-block",
                marginBottom: "0px",
                lineHeight: 1.42857,
                textAlign: "center",
                whiteSpace: "nowrap",
                verticalAlign: "middle",
                touchAction: "manipulation",
                cursor: "pointer",
                padding: "6px 12px",
                border: "1px solid #ddd",
                background: "#fff",
                borderRadius: "4px",
                marginRight: "4px"
            },
            tips:{
                minWidth: "200px",
                height: "50px",
                lineHeight: "50px",
                textAlign: "center",
                fontSize: "16px",
                background: "#fff",
                color: "#888",
                position: "fixed",
                top: "25%",
                left: "50%",
                marginLeft: "-100px",
                index: 9999,
                borderRadius: "4px",
                border: "1px solid rgba(0,0,0,.2)",
                outline: 0,
            	backgroundClip: "padding-box",
            	boxShadow: "0 3px 9px rgba(0,0,0,.5)"
            }
        };
        this.options = $.extend(true, {}, this.defaults, opt);
        //尾部动态样式
        this.CSS.popFooter = function(){
            var oFoot = {
                borderTop: "1px solid #ddd",
                padding: "15px",
                textAlign: _this.options.footer.align
            };
            return oFoot;
        }
        //创建模态框
        this.createPop = function(el){
            var strBox ='<div class="popBox">'+
                		  '<div class="pop-dialog">'+
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
            // strBox +=               '<button type="button" class="btn btnClose">关闭</button>'+
                                  '</div>'+
                              	'</div>'+
                            '</div>'+
                         '</div>';
            if($(".popBox").length>0){
                $(".popBox").remove();
            }
            $("body").append(strBox);

            $(".popBox .modal-footer .obtn").click(function(event) {
                var i = $(this).index();
                if($.isFunction(oFuns[i])){
                    oFuns[i]();
                }else {
                    throw new Error( "错误：请检查回调函数是否与按钮对应..." );
                }
            });
        }
        //拖拽
        this.drag = function() {
            var move = false; //移动标记
            var _x, _y; //鼠标离控件左上角的相对位置
            $(".pop-header").css({cursor:"move"});
            $(".pop-header").mousedown(function(e) {
                move = true;
                _x = e.pageX - parseInt($(".pop-dialog").css("left"));
                _y = e.pageY - parseInt($(".pop-dialog").css("top"));
            });
            $(document).mousemove(function(e) {
                if (move) {
                    var x = e.pageX - _x; //控件左上角到屏幕左上角的相对位置
                    var y = e.pageY - _y;
                    console.log(_x+":"+_y);
                    $(".pop-dialog").css({
                        "top": y,
                        "left": x
                    });
                }
            }).mouseup(function() {
                move = false;
            });
        }
        //创建提示框
        this.createTips = function(el){
            var strTips = '<div id="tipsBox">'+_this.options.tips.tips+'</div>';
            //避免重复插入
            if(!$("#tipsBox").length > 0){
                $("body").append(strTips);
            }
            setTimeout(function(){
                $("#tipsBox").fadeOut('slow', function() {
                    $("#tipsBox").remove();
                });
            },_this.options.tips.time);
        }
        this.create = function(){
            if ("pop" === this.options.type) {
                this.createPop();
                this.setText();
                this.loadHtml();
                this.loadController();
                this.close();
                this.setPopStyle();
                if(_this.options.drag) this.drag();
            }else if("tips" === this.options.type){
                this.createTips();
                this.createTipsStyle();
            }else{
                throw new Error( "type的参数为：pop或者tips...");
            }
        }
        //设置模态框样式
        this.setPopStyle = function(el) {
            $(".popBox").css(this.CSS.popBox);
            $(".popBox .pop-header").css(this.CSS.header);
            $(".popBox .pop-header .btnClose").css(this.CSS.btnClose);
            $(".pop-body").css(this.CSS.popBody);
            $(".popBox .pop-dialog").css(this.CSS.dialog);
            $(".popBox .modal-footer").css(this.CSS.popFooter());
            $(".popBox .modal-footer .btn").css(this.CSS.btn);
            $(".popBox .pop").css({borderRadius:"4px"});
            var oSize = _this.options.size;
            $(".popBox .pop-body").width(oSize[0]).height(oSize[1]);
            $(".popBox .pop-dialog").width(oSize[0]+32).css({marginLeft: -$(".pop-dialog").width()/2,marginTop:-$(".pop-dialog").height()/2});
        }
        //重置模态框的大小
        this.resetPop = function(){
            var initReset = _this.options.loadHtml.callback.prototype.reset = function(){
                $(".popBox .pop-dialog").css({marginLeft: -$(".pop-dialog").width()/2,marginTop:-$(".pop-dialog").height()/2});
            }
            initReset();
        }
        //设置提示框样式
        this.createTipsStyle = function(el) {
            $("#tipsBox").css(this.CSS.tips);
        }
        //关闭模态框
        this.close = function(){
            //普通的按钮关闭
            $(document).on("click",".popBox .btnClose",function(event){
                $(this).closest(".popBox").remove();
            });
            //是否点击模态框以外节点的关闭
            if (this.options.trigger) {
                $(".popBox").click(function(event){
                    //阻止事件冒泡
                    if(event.target == this){
                        $(".popBox .btnClose").trigger("click");
                    }
                });
            }
            //外部调用关闭
            if(_this.opt == "hide"){
                $(".popBox .btnClose").trigger("click");
            }
        }
        //设置文本内容
        this.setText = function(){
            //标题
            $(".popBox .pop-title").text(this.options.title);
            //内容
            $(".popBox .pop-body").text(this.options.msg);
        }
        //模态框读取页面
        this.loadHtml = function(){
            //是否读取页面
            if(this.options.loadHtml.read){
                $(".pop-body").empty();
                //可读取某页面的指定片段
                $(".pop-body").load(this.options.loadHtml.path,this.options.loadHtml.param,function(w){
                    if(w){
                        _this.options.loadHtml.callback();
                        _this.resetPop();
                    }
                });
            }
        }
        //读取controller返回的页面
        this.loadController = function(){
            //是否读取页面
            if(_this.options.loadController.deep){
                $(".pop-body").empty();
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
                        throw new Error( _this.options.loadController.callback + ",不是函数,请检查...");
                    };
                })
                .fail(function(res) {
                    throw new Error(res);
                });
            }
        }
    }

    //调用Pop的方法
     Pop.prototype.init = function(){
         this.create();
     }

    //使用Pop
    $.prototype.pop = function(options) {
        //调用方法
        var plugin = new Pop(this, options);
        return plugin.init();
    }

})(jQuery,window,document);
