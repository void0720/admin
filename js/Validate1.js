//表单验证

!(function ($, window, document, undefined) {
    $.fn.extend({
        validate: function(){
            $(this).bind('click',function(){
                var tag = true;
                var $el = $("form input");

                $.each( $el, function(index, el) {
                    var valid = this.required;//进行验证的标记
                    var min = this.min;//最小长度

                    if(valid){  //验证
                        var val = this.value;
                        $("form input:required").get(0).focus();
                            if(val=='' || val=='null'){  //检查是否为空 （此处可细化）
                                var $text = $(this).prev().text();
                                var error = $(this).parent().hasClass('has-error');

                                if(!error){//检查是否已经有错误提示
                                    // $(this).parent().addClass('has-error').append('<p class="error">'+$text+'不能为空</p>');
                                    $(this).parent().addClass('has-error has-feedback error').append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
                                    tag = false;
                                }
                            }else{
                                $(this).parent().removeClass('has-error has-feedback error');
                                tag = true;
                            }
                    }
                    $("form input:required").focus(function(event) {
                        $(this).parent().removeClass('has-error has-feedback error');
                    })
                    .blur(function(event) {
                        var $min = $(this).prev().text();
                        if($min<min){
                            var error = $(this).parent().hasClass('has-error');
                            if(error){
                                $(this).parent().addClass('has-error has-feedback error').append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span><p class="error">'+'不能为空</p>');
                            }

                        }
                    });

                });

                return tag;
            });



        }
    });

    $("input[type='submit']").validate();

})(window.jQuery, window, document);
