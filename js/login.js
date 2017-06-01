/**
 *登录脚本
 **/
$(function() {

    //友情提示
    useHigh();

    //表单提交
    $('.formBtn').on('click',function(event) {
        var state = $('.valid-form').validate('submitValidate');
        if (state) {
            window.location.href="../index.html";
        }
    });
    //获取验证码
    $("#verificationCode").click(function(event) {
        $(this).prev('.codebar').show();
    });
    //验证表单
    $('form').validate({
        onFocus: function() {
            this.parent().addClass('active');
            return false;
        },
        onBlur: function() {
            var $parent = this.parent();
            var _status = parseInt(this.attr('data-status'));
            $parent.removeClass('active');
            if (!_status) {
                $parent.addClass('error');
            }
            return false;
        }
    });
});
function useHigh(){
    if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") < "MSIE8.0") {
        alert("您的浏览器版本过低，建议使用高版本浏览器！");
    }
}
