//弹出框系列
//Author: wangyajun
//Date:2017.05.09

/**
======================================================================================================
一、模态框:
初始化:
    $('selector').openView({
        title:'请输入标题',//标题
        url:'',//地址
        type:'GET',//GET POST
        data:{},//参数
        callback:function(){},//页面加载完回调
        dataType:'html',//xml, json, script, 或者 html
        drag:true,//是否拖拽
        size:[600,300]//大小：[number,number] [number,'max'] ['max','max',boolean] ['max',number,boolean]
                      //布尔值表示重置大小(仅在高度为'max'下使用)
        // ,save:['保存','btn-info',function(){}] //自定义一个按钮 默认:无
    });
关闭:
    $('.boxWrap').close();
    如果关闭不掉,请尝试：$('.boxWrap').close(true);
======================================================================================================
二、提交框:
    $('selector').confirm(title,msg,btn,btnColor,callback);
    例子:$('selector').confirm('删除提示','确定要删除吗？','删除','btn-danger',function(){});
    参数解析:标题[string],提示内容[string],按钮文字[string],按钮颜色[string][四种：info/success/warning/danger],按钮函数[fn]
关闭:
    $('.boxWrap').close();
    如果关闭不掉,请尝试：$('.boxWrap').close(true);
======================================================================================================
三、提示框:
    $('selector').msg('自动消失提示框！',3,'center','success');
    参数解析:内容[string],消失时间[number],位置[string],类型[string][info/success/warning/danger]
======================================================================================================
四、通知框:
    $('selector').notice('标题','通知的内容');
    参数解析:标题[string],内容[string]
======================================================================================================
**/

;(function($, window, document, undefined) {

    $.fn.extend({

        //读取页面
        openView:function(opt){

            var Defaults = {
                title:'请输入标题',//标题
                url:'',//地址
                type:'GET',//GET POST
                data:{},//参数
                callback:function(){},//页面加载完回调
                dataType:'html',//xml, json, script, 或者 html
                drag:true,//是否拖拽
                size:[600,300]//大小：[number,number] [number,'max'] ['max','max',boolean] ['max',number,boolean]
                              //布尔值表示重置大小(仅在高度为'max'下使用)
                // ,save:['保存','btn-info',function(){}] //自定义一个按钮 默认:无
            };

            var opts = $.extend(true, {}, Defaults, opt);

            function doLoad(res){
                var boxWrap = $('.boxWrap'),
                    length = boxWrap.length,
                    modalTpl = '<div class="boxWrap" data-id="'+length+'">'+
                                    '<div class="box">'+
                                        '<div class="boxHeader">'+
                                            '<span class="boxTitle">'+opts.title+'</span>'+
                                            '<span class="close modalClose">×</span>'+
                                        '</div>'+
                                        '<div class="contents">'+res+'</div>'+
                                        '<div class="footer">';
                    if (opts.save && opts.save.length) {
                        modalTpl +=         '<button type="button" class="btn '+opts.save[1]+'">'+opts.save[0]+'</button>';
                    }
                        modalTpl +=         '<button type="button" class="btn btn-default modalClose">关闭</button>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';

                $('body').append(modalTpl);
                $('.boxWrap').close();

                var _box = $('.boxWrap[data-id="'+length+'"] .box'),
                    _header = $('.boxWrap[data-id="'+length+'"] .boxHeader'),
                    _contents = $('.boxWrap[data-id="'+length+'"] .contents'),
                    _footer = $('.boxWrap[data-id="'+length+'"] .footer');

                if (opts.size && opts.size.length) {

                    if (typeof opts.size[1] =='number') {
                        opts.size[1]>150? opts.size[1]=opts.size[1]:opts.size[1]=150;
                        _box.innerWidth(opts.size[0]);
                    }

                    _box.innerHeight(opts.size[1]);
                    _contents.innerHeight(_box.height()-_header.outerHeight()-_footer.outerHeight());

                    if (opts.size[0]=='max') {
                        _box.width($(window).width()-60);
                    }
                    if (opts.size[1]=='max') {
                        _box.height($(window).height()-60);
                        var minus = _box.height()-_header.outerHeight()-_footer.outerHeight();
                        _contents.innerHeight(minus);
                    }
                    if (opts.size[2] && opts.size[2]==true) {
                        (function(){
                            $(window).resize(function(event) {
                                _box.height($(window).height()-60);

                                var boxh = _box.height();

                                boxh>300? boxh=boxh:boxh=300;
                                _box.height(boxh);
                                _contents.innerHeight(boxh-_header.outerHeight()-_footer.outerHeight());
                            })
                        }());
                    }
                }

                if (opts.save && opts.save.length) {
                    $('.boxWrap .'+opts.save[1]).off('click').on('click',function(event){
                        opts.save[2]();
                    });
                }

                //拖拽
                if (opts.drag) {
                    (function (_box,_header) {
                        var move = false,
                            _x, _y;

                        _box.css({position:"absolute",left: "50%",top:0,marginLeft:-_box.width()/2});
                        _header.css({cursor:"move"});
                        _header.mousedown(function(e) {
                            move = true;
                            if (e.preventDefault) {
                                e.preventDefault();
                            }
                            e.stopPropagation();
                            _x = e.pageX - parseInt($(this).closest(".box").css("left"));
                            _y = e.pageY - parseInt($(this).closest(".box").css("top"));
                        });
                        $(document).mousemove(function(e) {
                            if (move) {
                                if (e.preventDefault) {
                                    e.preventDefault();
                                }
                                e.stopPropagation();

                                var x = e.pageX - _x;
                                var y = e.pageY - _y;

                                $(e.target).closest(".box").css({
                                    "top": y,
                                    "left": x
                                });
                            }
                        }).mouseup(function() {
                            move = false;
                        });
                    }(_box,_header));
                }
            }

            $.ajax({
                url: opts.url,
                type: opts.type,
                dataType: opts.dataType,
                data: opts.data
            })
            .done(function(res) {
                doLoad(res);
                opts.callback();
            })
            .fail(function(res) {
                console.log(res);
            });
        },
        //关闭模态框
        close: function(deep){
            $('.modalClose').off('click').on('click',function(event){
                if(event.preventDefault){
                    event.preventDefault();
                }
                event.stopPropagation();
                $(this).closest('.boxWrap').remove();
            });
            if(deep) $('.modalClose').trigger('click');
        },
        //提交框
        confirm: function(title,msg,btn,btnColor,callback){
            var boxWrap = $('.boxWrap'),
                length = boxWrap.length,
                modalTpl = '<div class="boxWrap" data-id="'+length+'">'+
                                '<div class="box">'+
                                    '<div class="boxHeader">'+
                                        '<span class="boxTitle">'+title+'</span>'+
                                        '<span class="close modalClose">×</span>'+
                                    '</div>'+
                                    '<div class="contents">'+msg+'</div>'+
                                    '<div class="footer">';
                    modalTpl +=         '<button type="button" class="sureClose btn '+btnColor+'">'+btn+'</button>';
                    modalTpl +=         '<button type="button" class="btn btn-default modalClose">关闭</button>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';

            $('body').append(modalTpl);
            $('.boxWrap').close();
            $('.boxWrap .sureClose').off('click').on('click',function(event) {
                callback();
                $(".sureClose").closest('.boxWrap').remove();
            });

        },
        //自动消失提示框
        msg: function(msg,time,pos,log){

            var msgTpl,
                t = parseInt(time),
                d = new Date(),
                timer = t*1000,
                length = d.getTime();

            msgTpl = '<div class="msg" data-id="'+length+'">'+
                         '<div class="log"></div>'+
                         '<div class="msgCont">'+
                            // '<div class="timer">('+t+'秒后自动消失)</div>'+
                            msg+
                         '</div>'+
                         '<span class="close msgClose">×</span>'+
                     '</div>';

            $('body').append(msgTpl);

            var iter = null,
                _msg = $('.msg[data-id="'+length+'"]'),
                _msgLog = _msg.find('.log'),
                _msgClose = _msg.find('.msgClose');

            switch(pos){
                case 'center': _msg.css({right:'0px'});break;
                case 'right': _msg.css({left:'inherit',right:'8px'});break;
            }

            _msg.animate({'margin-top':30,'opacity':'1'},300);

            switch(log){
                case 'info': _msgLog.addClass('info').text('i');break;
                case 'success': _msgLog.addClass('success').text('√');break;
                case 'warning': _msgLog.addClass('warning').text('!');break;
                case 'danger': _msgLog.addClass('danger').text('×');break;
            }

            _msgClose.off('click').on('click',function(){
                $(this).closest('.msg').remove();
            });

            clearInterval(iter);

            function secd(length){
                // $('.timer').text('('+(t-=1)+'秒后自动消失)')
                t--;
                if (t<1) {
                    if (_msg) _msg.closest('.msg').remove();
                    clearInterval(iter);
                }
            }
            function _secd(length){
                return function(){
                    secd(length);
               }
            }
            iter = setInterval(_secd(length),1000);

        },
        //消息提示框
        notice: function(title,notice){

            var noticeWrap = '<div class="noticeWrap"></div>',
                noticeTpl = '<div class="noticeGroup">'+
                                '<div class="noticeTitle">'+title+'<span class="close noticeClose">×</span></div>'+
                                '<div class="noticeCont">'+notice+'</div>'+
                            '</div>';

            var l = $('.noticeWrap').length;

            if (l<1) $('body').append(noticeWrap);
            $('.noticeWrap').append(noticeTpl);
            $(".noticeGroup").slideDown();

            $(document).on('click', '.noticeClose', function(event) {
                if (event.preventDefault) {
                    event.preventDefault();
                }
                var n = $('.noticeGroup').length;

                if(n>1){
                    $(this).closest('.noticeGroup').remove();
                }else{
                    $(this).closest('.noticeWrap').remove();
                }
            });

        }
    });

})(jQuery, window, document);
