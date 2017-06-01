/**
*   author : wangyajun
*   date : 2017-04-17
*   note: jQuery-1.9.1
**/
/**
*插件用法：
*
*
*
**/
;(function($,window,document,undefined){
    $.prototype.extend({
        create: function(){
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
            var sure =              '<button type="button" class="btn btn-primary sure">确定</button>';
            var close =             '<button type="button" class="btn btn-default btnClose">关闭</button>';
            //配置按钮
            // strBox += sure;
            // strBox += close;
            strBox +=           '</div>';
            strBox +=      	'</div>';
            strBox +=    '</div>';
            strBox +=  '</div>';
            $("body").append(strBox);
        },
        style: function(){
            var css = {
                popBox: {
                    width:"100%",
                    height:"100%",
                    background:"rgba(0,0,0,.5)",
                    position:"fixed",
                    top:0,left:0
                },
                pop: {
                    width: "600px",
                    margin: "30px auto",
                    border: "1px solid rgba(0,0,0,.2)",
                    outline: 0,
                    "min-height": "170px",
                    "background-color": "#fff",
                    "-webkit-background-clip": "padding-box",
                    "background-clip": "padding-box",
                    "border-radius": "6px",
                    "-webkit-box-shadow": "0 3px 9px rgba(0,0,0,.5)",
                    "box-shadow": "0 3px 9px rgba(0,0,0,.5)"
                },
                popHeader: {
                    "min-height": "16.43px",
                    padding: "15px",
                    "border-bottom": "1px solid #e5e5e5"
                },
                close: {
                    float: "right",
                    "font-size": "21px",
                    "font-weight": 700,
                    "line-height": 1,
                    color: "#000",
                    "text-shadow":" 0 1px 0 #fff",
                    filter: "alpha(opacity=20)",
                    opacity: .2,
                    border: 0,
                    background:"#fff",
                    cursor: "pointer"
                },
                body: {
                    padding:"15px",
                    "min-height":"30px"
                },
                footer:{
                    "text-align":"right",
                    "padding": "15px",
                    "border-top": "1px solid #e5e5e5"
                },
                btn: {
                    "-moz-user-select": "none",
                    "-webkit-user-select": "none",
                    "-ms-user-select": "none",
                    "-khtml-user-select": "none",
                    "user-select": "none",
                    display: "inline-block",
                    padding: "6px 12px",
                    "line-height": 1.42857143,
                    "text-align": "center",
                    "white-space": "nowrap",
                    "vertical-align": "middle",
                    "-ms-touch-action": "manipulation",
                    "touch-action": "manipulation",
                    cursor: "pointer",
                    "-webkit-user-select": "none",
                    "-moz-user-select": "none",
                    "-ms-user-select": "none",
                    "user-select": "none",
                    border: "1px solid transparent",
                    "border-radius": "4px",
                    border: "1px solid #ccc",
                    "margin-left": "5px"
                }
            };
            $("#popBox").css(css.popBox);
            $("#popBox .pop").css(css.pop);
            $("#popBox .pop-header").css(css.popHeader);
            $("#popBox .close").css(css.close);
            $("#popBox .pop-body").css(css.body);
            $("#popBox .pop-footer").css(css.footer);
            $("#popBox .pop-footer .btn").css(css.btn);
        },
        popClose: function(){
            $("#popBox .btnClose").click(function(event) {
                $("#popBox").remove();
            });
        },
        popText: function(t,m,btn){
            $(".pop-title").text(t);
            $(".pop-body").text(m);
            for (var i = 0; i < btn.btn.length; i++) {
                var oBtn = $("<button class='btn btn"+i+"'></button>");
                $("#popBox .pop-footer").append(oBtn.text(btn.btn[i]));
            }
            $("#popBox .pop-footer").append($("<button class='btn btnClose'>关闭</button>"));
            // var fnArr = [];
            for (var i = 0; i < btn.callback.length; i++) {
                if($.isFunction(btn.callback[i])){
                    // fnArr.push(btn.callback[i]);
                    $("btn"+i)
                    btn.callback[i]();
                }else{
                    console.log(btn.callback[i]+"不是函数,请检查...");
                }
            }
            // console.log(fnArr);
        },
        initPop: function(t,m,btn){
            $.fn.create();
            $.fn.popText(t,m,btn);
            $.fn.style();
            $.fn.popClose();
        },
        open: function(t,m,btn){
            $.prototype.initPop(t,m,btn);
        }
    });

})(jQuery,window,document);
